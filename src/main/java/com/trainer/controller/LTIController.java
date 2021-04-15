package com.trainer.controller;


import com.trainer.dto.LTIUser;
import com.trainer.model.User;
import com.trainer.security.LTIService;
import com.trainer.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.logging.Level;
import java.util.logging.Logger;

@Controller
public class LTIController {

    private Logger log = Logger.getLogger(LTIController.class.getName());

    @Resource
    private UserService userService;

    @Resource
    private LTIService ltiService;

    @PostMapping("/api/lti/launch")
    public RedirectView authenticate(HttpServletRequest request, HttpServletResponse response) throws Exception{
        log.log(Level.INFO, "Authenticating with LTI SSO");
        LTIUser ltiUser = ltiService.authenticate(request);

        User user = userService.findOrCreateStudent(ltiUser.getLogin(), ltiUser.getEmail(), ltiUser.getFullName());

        log.log(Level.INFO, "LTI user loaded");
        userService.authenticateSSOUser(user);

        log.log(Level.INFO, "LTI user successfully logged in");
        RedirectView result = new RedirectView("/index.html");
        result.addStaticAttribute("result", "success");

        return result;
    }
}
