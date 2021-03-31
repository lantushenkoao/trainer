package com.trainer.service;

import com.trainer.model.Role;
import com.trainer.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public List<Role> list() {
        return roleRepository.findAll();
    }

    public Role getByName(String roleName) {
        return roleRepository.findByName(roleName);
    }
}
