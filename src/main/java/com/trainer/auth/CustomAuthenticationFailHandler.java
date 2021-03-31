package com.trainer.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trainer.dto.ErrorDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomAuthenticationFailHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    private ObjectMapper jacksonObjectMapper;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {
        ErrorDto errorDto = new ErrorDto("Неверный логин или пароль");

        response.setStatus(400);
        response.setContentType("text/html; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().print(jacksonObjectMapper.writeValueAsString(errorDto));
        response.getWriter().flush();
    }
}
