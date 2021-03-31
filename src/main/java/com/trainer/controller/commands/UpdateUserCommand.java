package com.trainer.controller.commands;

import com.trainer.validation.EqualFields;
import com.trainer.validation.ValidRole;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
@EqualFields(baseField = "passwordConfirm", matchField = "password")
public class UpdateUserCommand {

    @NotNull
    private Long id;

    @NotEmpty(message = "Введите имя")
    @Length(max = 100, message = "Имя должно быть не длиннее {max} символов")
    private String name;

    @NotEmpty(message = "Введите логин")
    @Pattern(regexp = "\\w+", message = "Логин должен содержать только символы латиницы")
    @Length(max = 20, message = "Логин должен быть не длиннее {max} символов")
    private String username;

    private String currentPassword;

    @Pattern(regexp="^(\\S*|\\S{6,20})$", message="Пароль должен быть от 6 до 100 символов")
    private String password;

    private String passwordConfirm;

    @Length(max = 50, message = "Электронный адрес должен быть до {max} символов")
    @Email(message = "Введите валидный электронный адрес")
    private String email;

    @NotNull(message = "Выберите роль")
    @ValidRole
    private String role;

}