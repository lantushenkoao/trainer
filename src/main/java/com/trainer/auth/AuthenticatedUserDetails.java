package com.trainer.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Data
@AllArgsConstructor
public class AuthenticatedUserDetails implements UserDetails {
    private String password;
    private String username;
    private boolean accountNonExpired;
    private boolean accountNonLocked;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean credentialsNonExpired;
    private boolean enabled;
}
