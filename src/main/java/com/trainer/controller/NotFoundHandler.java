package com.trainer.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;

@Controller
public class NotFoundHandler implements ErrorController {

    @RequestMapping("/error")
    public String sendRedirect(HttpServletRequest req){
        return "index.html";
    }

    @Override
    public String getErrorPath() {
        return null;
    }
}
