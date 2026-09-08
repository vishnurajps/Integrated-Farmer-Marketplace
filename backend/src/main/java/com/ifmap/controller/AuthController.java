package com.ifmap.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ifmap.dto.LoginRequest;
import com.ifmap.dto.LoginResponse;
import com.ifmap.dto.RegisterRequest;
import com.ifmap.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;


    public AuthController(UserService userService) {

        this.userService = userService;

    }


    // ==========================
    // REGISTER API
    // ==========================

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestBody RegisterRequest request
    ) {

        String response =
                userService.registerUser(request);

        return ResponseEntity.ok(response);

    }


    // ==========================
    // LOGIN API
    // ==========================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(
            @RequestBody LoginRequest request
    ) {

        LoginResponse response =
                userService.loginUser(request);

        return ResponseEntity.ok(response);

    }

}