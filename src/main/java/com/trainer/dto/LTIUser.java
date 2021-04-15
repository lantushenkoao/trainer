package com.trainer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LTIUser {
    String fullName;
    String email;
    String login;
}
