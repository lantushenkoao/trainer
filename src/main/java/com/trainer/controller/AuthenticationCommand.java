package com.trainer.controller;

import lombok.Data;

@Data
public class AuthenticationCommand {
    private String username;
    private String password;
}
