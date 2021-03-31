package com.trainer.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trainer.controller.AuthenticationCommand;
import org.apache.commons.io.IOUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class CustomUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private String jsonUsername;
    private String jsonPassword;

    @Override
    protected String obtainPassword(HttpServletRequest request) {
        return this.jsonPassword;
    }

    @Override
    protected String obtainUsername(HttpServletRequest request) {
        return this.jsonUsername;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = IOUtils.toString(request.getReader());
            AuthenticationCommand authenticationCommand = mapper.readValue(json, AuthenticationCommand.class);

            this.jsonUsername = authenticationCommand.getUsername();
            this.jsonPassword = authenticationCommand.getPassword();

        }catch (Exception e){
            e.printStackTrace();
        }

        return super.attemptAuthentication(request, response);
    }
}
