package com.trainer.controller;

import com.trainer.auth.TrainerSession;
import com.trainer.controller.commands.CreateUserCommand;
import com.trainer.controller.commands.UpdateUserCommand;
import com.trainer.dto.TopicStatisticsDto;
import com.trainer.exception.TrainerException;
import com.trainer.model.User;
import com.trainer.service.PermissionService;
import com.trainer.service.RoleService;
import com.trainer.service.TopicService;
import com.trainer.service.UserService;
import com.trainer.validation.UniqueEmailValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import static com.trainer.security.Roles.ADMIN;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RoleService roleService;
    private final PermissionService permissionService;
    private final PasswordEncoder passwordEncoder;
    private final UniqueEmailValidator uniqueEmailValidator;
    private final TopicService topicService;

    @GetMapping("getSession")
    public TrainerSession getSession(HttpServletRequest request) {
        User currentUser = userService.getCurrentUser();
        String csrfToken = ((CsrfToken) request.getAttribute(CsrfToken.class.getName())).getToken();
        return new TrainerSession(currentUser, csrfToken);
    }

    @Secured({ADMIN})
    @GetMapping("get")
    public User getById(@RequestParam Long id){
        return userService.getById(id);
    }

    @Secured({ADMIN})
    @GetMapping("list")
    public List<User> list(){
        return userService.listAll();
    }

    @GetMapping("statistics")
    public List<TopicStatisticsDto> getStatistics(@RequestParam Long id){
        User currentUser = userService.getCurrentUser();
        if (!permissionService.isAdmin(currentUser) && !currentUser.getId().equals(id)) {
            throw new TrainerException("У Вас нет доступа к этой странице");
        }

        return topicService.listAllForUser(id)
                .stream()
                .map(TopicStatisticsDto::new)
                .collect(Collectors.toList());
    }

    @Secured({ADMIN})
    @PostMapping("create")
    public User create(@Valid @RequestBody CreateUserCommand command, Errors errors) {

        if (errors.hasErrors()) {
            throw new TrainerException(errors);
        }

        User user = new User();
        user.setName(command.getName());
        user.setEmail(command.getEmail());
        user.setRoles(new HashSet<>(Collections.singletonList(roleService.getByName(command.getRole()))));
        user.setUsername(command.getUsername());
        user.setPassword(passwordEncoder.encode(command.getPassword()));

        return userService.saveOrUpdate(user);
    }

    @PostMapping("update")
    public User update(@Valid @RequestBody UpdateUserCommand command, Errors errors) {

        User currentUser = userService.getCurrentUser();
        boolean selfUpdate = command.getId().equals(currentUser.getId());

        User originalUser = selfUpdate
                ? currentUser
                : userService.getById(command.getId());

        permissionService.checkEditUser(originalUser);

        if(!selfUpdate && !permissionService.isAdmin()) {
            throw new TrainerException("Вы не можете редактировать других пользователей");
        }

        if (!command.getUsername().equals(originalUser.getUsername())) {
            throw new TrainerException("Вы не можете изменять логин");
        }

        boolean roleChanged = originalUser.getRoles()
                .stream()
                .noneMatch(role -> role.getName().equals(command.getRole()));

        if (roleChanged && !permissionService.isAdmin()) {
            throw new TrainerException("Вы не можете изменять роль");
        }

        if (!command.getEmail().equals(originalUser.getEmail()) &&
                !uniqueEmailValidator.isValid(command.getEmail(), null)) {
            errors.rejectValue("email", null, "Пользователь с таким электронным адресом уже существует");
        }

        boolean passwordChanged = !StringUtils.isEmpty(command.getPassword()) &&
                !passwordEncoder.matches(command.getPassword(), originalUser.getPassword());

        if (passwordChanged && selfUpdate && !originalUser.isSSOLogin() &&
                !passwordEncoder.matches(command.getCurrentPassword(), originalUser.getPassword())) {
            errors.rejectValue("currentPassword", null, "Неверный текущий пароль");
        } else if (passwordChanged) {
            originalUser.setPassword(passwordEncoder.encode(command.getPassword()));
        }

        if (errors.hasErrors()) {
            throw new TrainerException(errors);
        }

        originalUser.setName(command.getName());
        originalUser.setEmail(command.getEmail());
        originalUser.setRoles(new HashSet<>(Collections.singletonList(roleService.getByName(command.getRole()))));

        return userService.saveOrUpdate(originalUser);
    }

    @Secured({ADMIN})
    @PostMapping("delete")
    public void delete(@RequestBody User user) {
        if (userService.getCurrentUser().getId().equals(user.getId())) {
            throw new TrainerException("Вы не можете удалить свою учётную запись");
        }
        userService.delete(user.getId());
    }

}