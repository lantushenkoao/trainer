package com.trainer.controller.commands;

import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class LoginCommand {

    @NotEmpty(message = "Введите логин")
    private String login;

    @NotEmpty(message = "Введите пароль")
    private String password;

}
