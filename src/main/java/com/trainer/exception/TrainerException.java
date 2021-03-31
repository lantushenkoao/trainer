package com.trainer.exception;

import lombok.Getter;
import org.springframework.validation.Errors;

@Getter
public class TrainerException extends RuntimeException {

    private static final String DEFAULT_MESSAGE = "Произошла ошибка. Обратитесь к администратору";
    private Errors errors;

    public TrainerException(Errors errors) {
        super();
        this.errors = errors;
    }

    public TrainerException(String message) {
        super(message);
    }

    public TrainerException() {
        super(DEFAULT_MESSAGE);
    }

}