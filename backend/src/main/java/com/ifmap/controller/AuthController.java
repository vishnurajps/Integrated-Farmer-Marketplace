package com.ifmap.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.ifmap.dto.LoginRequest;
import com.ifmap.dto.LoginResponse;
import com.ifmap.dto.RegisterRequest;
import com.ifmap.dto.UserProfileRequest;
import com.ifmap.dto.UserProfileResponse;

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
    // REGISTER USER
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
    // LOGIN USER
    // ==========================

    @PostMapping("/login")

    public ResponseEntity<LoginResponse> loginUser(

            @RequestBody LoginRequest request

    ) {


        LoginResponse response =
                userService.loginUser(request);


        return ResponseEntity.ok(response);

    }


    // ==========================
    // GET USER PROFILE
    // ==========================

    @GetMapping("/users/{id}")

    public ResponseEntity<?> getUserProfile(

            @PathVariable Long id

    ) {


        try {

            UserProfileResponse response =
                    userService.getUserProfile(id);


            return ResponseEntity.ok(response);

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }


    // ==========================
    // UPDATE USER PROFILE
    // ==========================

    @PutMapping("/users/{id}")

    public ResponseEntity<?> updateUserProfile(

            @PathVariable Long id,

            @RequestBody UserProfileRequest request

    ) {


        try {

            UserProfileResponse response =
                    userService.updateUserProfile(
                            id,
                            request
                    );


            return ResponseEntity.ok(response);

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }

}