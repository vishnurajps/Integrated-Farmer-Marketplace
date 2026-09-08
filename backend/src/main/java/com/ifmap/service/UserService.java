package com.ifmap.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ifmap.dto.LoginRequest;
import com.ifmap.dto.LoginResponse;
import com.ifmap.dto.RegisterRequest;

import com.ifmap.entity.User;
import com.ifmap.entity.UserRole;

import com.ifmap.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {

        this.userRepository = userRepository;

    }


    // ==========================
    // REGISTER USER
    // ==========================

    public String registerUser(RegisterRequest request) {


        // Check mobile number

        if (request.getMobile() == null ||
                request.getMobile().isBlank()) {

            return "Mobile number is required";

        }


        // Check duplicate mobile

        if (userRepository.existsByMobile(
                request.getMobile())) {

            return "Mobile number already registered";

        }


        // ==========================
        // HANDLE OPTIONAL EMAIL
        // ==========================

        String email = request.getEmail();


        if (email != null) {

            email = email.trim();

            // Convert empty email to null

            if (email.isEmpty()) {

                email = null;

            }

        }


        // Check duplicate email

        if (email != null &&
                userRepository.existsByEmail(email)) {

            return "Email already registered";

        }


        // ==========================
        // CREATE USER
        // ==========================

        User user = new User();

        user.setFullName(request.getFullName());

        user.setMobile(request.getMobile());

        user.setEmail(email);

        user.setPassword(request.getPassword());

        user.setRole(request.getRole());

        user.setState(request.getState());

        user.setDistrict(request.getDistrict());

        user.setAddress(request.getAddress());

        user.setCertificateNumber(
                request.getCertificateNumber()
        );


        // ==========================
        // ADVISOR VERIFICATION
        // ==========================

        if (request.getRole() == UserRole.ADVISOR) {

            user.setIsVerified(false);

        } else {

            user.setIsVerified(true);

        }


        // Save User

        userRepository.save(user);


        return "Registration Successful";

    }



    // ==========================
    // LOGIN USER
    // ==========================

    public LoginResponse loginUser(LoginRequest request) {

        Optional<User> userOptional =
                userRepository.findByMobile(
                        request.getMobile()
                );


        if (userOptional.isEmpty()) {

            return new LoginResponse(

                    "Mobile number not registered",

                    "",

                    null,

                    ""

            );

        }


        User user = userOptional.get();


        // ==========================
        // CHECK PASSWORD
        // ==========================

        if (!user.getPassword()
                .equals(request.getPassword())) {

            return new LoginResponse(

                    "Incorrect Password",

                    "",

                    null,

                    ""

            );

        }


        // ==========================
        // SUCCESSFUL LOGIN
        // ==========================

        return new LoginResponse(

                "Login Successful",

                user.getRole().name(),

                user.getId(),

                user.getFullName()

        );

    }
}