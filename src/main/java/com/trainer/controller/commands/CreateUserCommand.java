package com.trainer.controller.commands;

import com.trainer.validation.EqualFields;
import com.trainer.validation.UniqueEmail;
import com.trainer.validation.UniqueLogin;
import com.trainer.validation.ValidRole;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
@EqualFields(baseField = "passwordConfirm", matchField = "password")
public class CreateUserCommand {

    @NotEmpty(message = "Введите имя")
    @Length(max = 100, message = "Имя должно быть не длиннее {max} символов")
    private String name;

    @NotEmpty(message = "Введите логин")
    @Length(max = 20, message = "Логин должен быть не длиннее {max} символов")
    @Pattern(regexp = "\\w+", message = "Логин должен содержать только символы латиницы")
    @UniqueLogin
    private String username;

    @Length(min = 6, max = 20, message = "Пароль должен быть от {min} до {max} символов")
    private String password;

    private String passwordConfirm;

    @Length(max = 50, message = "Электронный адрес должен быть до {max} символов")
    @Email(message = "Введите валидный электронный адрес")
    @UniqueEmail
    private String email;

    @NotNull(message = "Выберите роль")
    @ValidRole
    private String role;

}
