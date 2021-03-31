package com.trainer.validation;

import com.trainer.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class RoleValidator implements ConstraintValidator<ValidRole, String> {

    @Autowired
    private RoleService roleService;

    @Override
    public void initialize(ValidRole constraintAnnotation) {}

    @Override
    public boolean isValid(String roleName, ConstraintValidatorContext context){
        return roleService.list()
                .stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }
}
