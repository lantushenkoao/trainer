package com.trainer.controller;

import com.trainer.dto.ErrorDto;
import com.trainer.exception.TrainerException;
import com.trainer.service.BugReportService;
import com.trainer.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
class GlobalExceptionHandler {

    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${bugreport.enable}")
    private boolean bugReportEnabled;

    @Autowired
    private UserService userService;

    @Autowired
    private BugReportService bugReportService;

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ErrorDto handle(HttpServletRequest request, Exception ex) {

        if (ex instanceof TrainerException) {
            return ((TrainerException)ex).getErrors() != null
                    ? new ErrorDto(((TrainerException)ex).getErrors())
                    : new ErrorDto(ex.getMessage());
        } else {
            logger.error("An exception was thrown", ex);
            if (bugReportEnabled) {
                bugReportService.sendBugReport(request, userService.getCurrentUser(), ex);
            }
            return new ErrorDto("Произошла ошибка.\nОбратитесь к администратору:\n" + adminEmail);
        }

    }
}