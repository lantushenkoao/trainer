package com.trainer.service;

import com.trainer.auth.AuthenticatedUserDetails;
import com.trainer.exception.TrainerException;
import com.trainer.model.User;
import com.trainer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        return principal instanceof AuthenticatedUserDetails
                ? findByUsername(((AuthenticatedUserDetails) principal).getUsername())
                : null;
    }

    public User saveOrUpdate(User user) {
        return userRepository.save(user);
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new TrainerException("Пользователь не найден"));
    }

    public void delete(Long id) {
        User user = getById(id);
        user.setDeleted(true);
        saveOrUpdate(user);
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