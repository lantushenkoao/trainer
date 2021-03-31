package com.trainer.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.lang.reflect.Field;

public class EqualFieldsValidator implements ConstraintValidator<EqualFields, Object> {

    private String baseField;
    private String matchField;
    private String message;

    @Override
    public void initialize(EqualFields constraint) {
        baseField = constraint.baseField();
        matchField = constraint.matchField();
        message = constraint.message();
    }

    @Override
    public boolean isValid(Object type, ConstraintValidatorContext context) {
        try {
            Object baseFieldValue = getFieldValue(type, baseField);
            Object matchFieldValue = getFieldValue(type, matchField);
            boolean isValid = baseFieldValue != null && baseFieldValue.equals(matchFieldValue);
            if (!isValid) {
                return buildConstraintViolation(context);
            }
        } catch (Exception e) {
            return buildConstraintViolation(context);
        }
        return true;
    }

    private boolean buildConstraintViolation(ConstraintValidatorContext context){
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(baseField)
                .addConstraintViolation();
        return false;
    }

    private Object getFieldValue(Object type, String fieldName) throws Exception {
        Class<?> clazz = type.getClass();
        Field field = clazz.getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(type);
    }

}