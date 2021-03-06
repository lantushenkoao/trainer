package com.trainer.service;

import com.trainer.auth.AuthenticatedUserDetails;
import com.trainer.controller.LTIController;
import com.trainer.exception.TrainerException;
import com.trainer.model.Role;
import com.trainer.model.User;
import com.trainer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

@Service
public class UserService implements UserDetailsService {

    private Logger log = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleService roleService;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (null == authentication) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        return principal instanceof AuthenticatedUserDetails
                ? findByUsername(((AuthenticatedUserDetails) principal).getUsername())
                : null;
    }

    public User saveOrUpdate(User user) {
        if(user.isTransient()){
            log.info("Creating new user");
            //creating new user.
            //cannot use mysql constraints here because of soft delete approach
            if(userRepository.usernameIsUsed(user.getUsername()).equals(1)){
                throw new TrainerException("Login name is already in use");
            }
        }
        return userRepository.save(user);
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new TrainerException("???????????????????????? ???? ????????????"));
    }

    public void delete(Long id) {
        User user = getById(id);
        user.setDeleted(true);
        saveOrUpdate(user);
    }

    public User findOrCreateStudent(String login, String email, String fullName) {
        User user = userRepository.findByUsername(login);
        if(user != null) {
            return user;
        }
        user = new User();
        user.setName(fullName);
        user.setEmail(email);
        user.setPassword(" ");
        Role studentRole = roleService.getByName(com.trainer.security.Roles.STUDENT);
        user.setRoles(new HashSet<>(Collections.singletonList(studentRole)));
        user.setUsername(login);
        userRepository.save(user);
        return user;
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean usernameIsUsed(String username) {
        return userRepository.usernameIsUsed(username).intValue() != 0;
    }

    public boolean emailIsUsed(String email) {
        return userRepository.emailIsUsed(email).intValue() != 0;
    }

    public List<User> listAll() {
        return userRepository.findAll();
    }

    public void authenticateSSOUser(User user){
        UserDetails userDetails = loadUserByUsername(user.getUsername());

        UsernamePasswordAuthenticationToken authReq
                = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(authReq);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if (null == user) {
            throw new UsernameNotFoundException(null);
        }

        List<SimpleGrantedAuthority> authorities = new ArrayList<>(getGrantedAuthorityByCustomer(user));

        return new AuthenticatedUserDetails(user.getPassword(), user.getUsername(), true, true, authorities, true, true);

    }

    private List<SimpleGrantedAuthority> getGrantedAuthorityByCustomer(User user) {

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        user.getRoles().forEach(role ->
                authorities.add(new SimpleGrantedAuthority(role.getName())));

        return authorities;
    }

}