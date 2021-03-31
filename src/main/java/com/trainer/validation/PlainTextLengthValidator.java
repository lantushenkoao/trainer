package com.trainer.validation;

import org.jsoup.Jsoup;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PlainTextLengthValidator implements ConstraintValidator<PlainTextLength, String> {

    private int minLength;
    private int maxLength;

    @Override
    public void initialize(PlainTextLength constraintAnnotation) {
        minLength = constraintAnnotation.min();
        maxLength = constraintAnnotation.max();
    }

    @Override
    public boolean isValid(String content, ConstraintValidatorContext context) {
        String plainText = Jsoup.parse(content).text();
        return plainText.length() >= minLength && plainText.length() <= maxLength;
    }

}
