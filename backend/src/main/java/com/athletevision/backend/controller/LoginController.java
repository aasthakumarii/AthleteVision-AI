package com.athletevision.backend.controller;

import com.athletevision.backend.dto.LoginRequest;
import com.athletevision.backend.service.LoginService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return loginService.login(request);
    }
}