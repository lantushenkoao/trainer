package com.trainer.dto;

import lombok.Data;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.validation.Errors;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ErrorDto {

    private List<String> errors;

    public ErrorDto(String message) {
        this.errors = Collections.singletonList(message);
    }

    public ErrorDto(Errors errors) {
        this.errors = errors.getAllErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());
    }

}