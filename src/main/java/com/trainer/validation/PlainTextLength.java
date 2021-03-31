package com.trainer.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = PlainTextLengthValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PlainTextLength {

    String message() default "Длина текста должна быть от {min} до {max} сиимволов";
    int min();
    int max();
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

}