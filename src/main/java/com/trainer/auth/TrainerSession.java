package com.trainer.auth;

import com.trainer.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrainerSession {
    private User currentUser;
    private String csrfToken;
}
