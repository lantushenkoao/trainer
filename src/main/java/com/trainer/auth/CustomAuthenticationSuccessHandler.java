package com.trainer.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trainer.model.User;
import com.trainer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper jacksonObjectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        response.setContentType("text/html; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        User currentUser = userService.getCurrentUser();
        String csrfToken = ((CsrfToken) request.getAttribute(CsrfToken.class.getName())).getToken();
        TrainerSession session = new TrainerSession(currentUser, csrfToken);

        response.getWriter().print(jacksonObjectMapper.writeValueAsString(session));
        response.getWriter().flush();
    }
}
