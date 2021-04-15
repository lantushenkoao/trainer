package com.trainer.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Where;
import org.hibernate.validator.constraints.Length;
import org.springframework.util.StringUtils;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NamedEntityGraph(name = "User.roles", attributeNodes = @NamedAttributeNode("roles"))
@Where(clause = "is_deleted = 0")
@ToString(exclude = {"password"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Введите имя")
    @Length(max = 100, message = "Имя должно быть не длиннее {max} символов")
    private String name;

    @NotEmpty(message = "Введите логин")
    @Length(max = 20, message = "Логин должен быть не длиннее {max} символов")
    private String username;

    @Length(max = 50, message = "Электронный адрес должен быть до {max} символов")
    @Email
    private String email;

    //@NotBlank password should be blank for SSO login
    @JsonIgnore
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    boolean isDeleted;

    public boolean isSSOLogin() {
        return !StringUtils.hasText(password);
    }

    public boolean isTransient(){
        return getId() == null;
    }
}
