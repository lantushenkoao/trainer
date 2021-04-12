package com.trainer.controller;


import com.trainer.exception.AuthenticationException;
import com.trainer.model.User;
import com.trainer.service.UserService;
import net.paulgray.lti.launch.LtiOauth10aVerifier;
import net.paulgray.lti.launch.LtiVerifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Controller
public class LTIController {

    private Logger log = Logger.getLogger(LTIController.class.getName());

    @Value("${lti.secretKey}")
    private String ltiSecretKey;

    @Resource
    private UserService userService;

    @Resource(name="authenticationManager")
    private AuthenticationManager authenticationManager;

    @PostMapping("/api/lti/launch")
    public RedirectView authenticate(HttpServletRequest request, HttpServletResponse response) {
        log.log(Level.INFO, "Authenticating with LTI SSO");
        LtiVerifier verifier = new LtiOauth10aVerifier();

        String key = request.getParameter("oauth_consumer_key");
        if(!ltiSecretKey.equals(key)){
            log.log(Level.INFO, "LTI secret key missmatch");
            throw new AuthenticationException("LTI Secret key missmatch");
        }
        Collection<? extends Map.Entry<String, String>> params = request.getParameterMap()
                .entrySet()
                .stream()
                .map(e-> {
                    Optional<String> val = Arrays.stream(e.getValue()).findFirst();
                    return new AbstractMap.SimpleEntry<>(e.getKey(), val.orElse(""));
                }).collect(Collectors.toList());

        verifier.verifyParameters(params,
                request.getRequestURL().toString(), "POST", ltiSecretKey);
        String userFullName = request.getParameter("lis_person_name_full");
        String userEmail = request.getParameter("lis_person_contact_email_primary");
        String login = request.getParameter("user_id");

        User user = userService.findOrCreateStudent(login, userEmail, userFullName);

        log.log(Level.INFO, "LTI user loaded");

        UserDetails userDetails = userService.loadUserByUsername(user.getUsername());

        UsernamePasswordAuthenticationToken authReq
                = new UsernamePasswordAuthenticationToken(userDetails, null);
//        Authentication auth = authenticationManager.authenticate(authReq);
        SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(authReq);


        log.log(Level.INFO, "LTI user successfully logged in");
        RedirectView result = new RedirectView("/index.html");
        result.addStaticAttribute("result", "success");

        return result;
    }
}
