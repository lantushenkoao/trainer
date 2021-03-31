package com.trainer.controller;

import com.trainer.model.Role;
import com.trainer.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.trainer.security.Roles.ADMIN;
import static com.trainer.security.Roles.METHODIST;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @Secured({ADMIN, METHODIST})
    @RequestMapping(value = "list")
    public List<Role> list() {
        return roleService.list();
    }
}
