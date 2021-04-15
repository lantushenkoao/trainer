package com.trainer.security;

import com.trainer.dto.LTIUser;
import net.paulgray.lti.launch.LtiOauth10aVerifier;
import net.paulgray.lti.message.LtiErrorable;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LTIService {
    @Value("${lti.secretKey}")
    private String ltiSecretKey;

    @Resource
    private LtiSignatureVerifier verifier;

    public LTIUser authenticate(HttpServletRequest request) throws Exception{

        Collection<? extends Map.Entry<String, String>> params = request.getParameterMap()
                .entrySet()
                .stream()
                .map(e-> {
                    Optional<String> val = Arrays.stream(e.getValue()).findFirst();
                    return new AbstractMap.SimpleEntry<>(e.getKey(), val.orElse(""));
                }).collect(Collectors.toList());

        verifier.verifyParameters(params, request.getRequestURL().toString(), "POST", ltiSecretKey);

        return LTIUser.builder()
                .email(request.getParameter("lis_person_contact_email_primary"))
                .fullName(request.getParameter("lis_person_name_full"))
                .login(request.getParameter("user_id"))
                .build();
    }
}
