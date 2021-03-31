package com.trainer.validation;

import com.trainer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class UniqueLoginValidator implements ConstraintValidator<UniqueLogin, String> {

    @Autowired
    private UserService userService;

    @Override
    public void initialize(UniqueLogin constraintAnnotation) {}

    @Override
    public boolean isValid(String login, ConstraintValidatorContext context){
        return !userService.usernameIsUsed(login);
    }
}
