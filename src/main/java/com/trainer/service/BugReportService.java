package com.trainer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;
import com.trainer.model.User;
import it.ozimov.springboot.mail.model.Email;
import it.ozimov.springboot.mail.model.defaultimpl.DefaultEmail;
import it.ozimov.springboot.mail.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.internet.InternetAddress;
import javax.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Collections;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class BugReportService {

    private final Logger logger = LoggerFactory.getLogger(BugReportService.class);

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${application.email}")
    private String applicationEmail;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ObjectMapper jacksonObjectMapper;


    @Async
    public void sendBugReport(HttpServletRequest request, User user, Exception ex) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        String exceptionTrace = sw.toString();

        Map<String, String[]> requestParams = Collections.list(request.getParameterNames())
                .stream()
                .collect(Collectors.toMap(
                        Function.identity(),
                        request::getParameterValues
                ));

        try {
            String messageBody = String
                    .format("User: %s\nReferrer: %s\nRequest URL: %s\nRequest params: %s\nException trace:\n%s",
                        user,
                        request.getHeader("referer"),
                        request.getRequestURL(),
                        !requestParams.isEmpty() ? jacksonObjectMapper.writeValueAsString(requestParams) : "",
                        exceptionTrace);

            Email email = DefaultEmail.builder()
                    .from(new InternetAddress(applicationEmail))
                    .to(Lists.newArrayList(new InternetAddress(adminEmail)))
                    .subject("Trainer exception")
                    .body(messageBody)
                    .encoding("UTF-8").build();

            emailService.send(email);
        } catch (Exception e) {
            logger.error("An exception was thrown", e);
        }
    }

}
