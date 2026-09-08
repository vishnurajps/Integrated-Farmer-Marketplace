package com.ifmap.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ifmap.dto.LoginRequest;
import com.ifmap.dto.LoginResponse;
import com.ifmap.dto.RegisterRequest;
import com.ifmap.dto.UserProfileRequest;
import com.ifmap.dto.UserProfileResponse;

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


        if (request.getMobile() == null ||
                request.getMobile().isBlank()) {

            return "Mobile number is required";

        }


        if (userRepository.existsByMobile(
                request.getMobile())) {

            return "Mobile number already registered";

        }


        String email = request.getEmail();


        if (email != null) {

            email = email.trim();

            if (email.isEmpty()) {

                email = null;

            }

        }


        if (email != null &&
                userRepository.existsByEmail(email)) {

            return "Email already registered";

        }


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


        if (!user.getPassword()
                .equals(request.getPassword())) {

            return new LoginResponse(
                    "Incorrect Password",
                    "",
                    null,
                    ""
            );

        }


        return new LoginResponse(
                "Login Successful",
                user.getRole().name(),
                user.getId(),
                user.getFullName()
        );

    }


    // ==========================
    // GET USER PROFILE
    // ==========================

    public UserProfileResponse getUserProfile(Long id) {


        User user = userRepository
                .findById(id)
                .orElseThrow(() ->

                        new RuntimeException(
                                "User not found with ID: " + id
                        )

                );


        return convertToProfileResponse(user);

    }


    // ==========================
    // UPDATE USER PROFILE
    // ==========================

    public UserProfileResponse updateUserProfile(

            Long id,

            UserProfileRequest request

    ) {


        User existingUser = userRepository
                .findById(id)
                .orElseThrow(() ->

                        new RuntimeException(
                                "User not found with ID: " + id
                        )

                );


        // ==========================
        // VALIDATE MOBILE
        // ==========================

        if (request.getMobile() == null ||
                request.getMobile().trim().isEmpty()) {

            throw new RuntimeException(
                    "Mobile number is required"
            );

        }


        String mobile =
                request.getMobile().trim();


        if (!mobile.equals(existingUser.getMobile()) &&
                userRepository.existsByMobile(mobile)) {

            throw new RuntimeException(
                    "Mobile number already registered"
            );

        }


        // ==========================
        // HANDLE EMAIL
        // ==========================

        String email = request.getEmail();


        if (email != null) {

            email = email.trim();

            if (email.isEmpty()) {

                email = null;

            }

        }


        // Check duplicate email

        if (email != null &&
                !email.equals(existingUser.getEmail()) &&
                userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email already registered"
            );

        }


        // ==========================
        // UPDATE PROFILE
        // ==========================

        existingUser.setFullName(
                request.getFullName()
        );

        existingUser.setMobile(
                mobile
        );

        existingUser.setEmail(
                email
        );

        existingUser.setState(
                request.getState()
        );

        existingUser.setDistrict(
                request.getDistrict()
        );

        existingUser.setAddress(
                request.getAddress()
        );


        User savedUser =
                userRepository.save(existingUser);


        return convertToProfileResponse(
                savedUser
        );

    }


    // ==========================
    // CONVERT USER TO RESPONSE
    // ==========================

    private UserProfileResponse convertToProfileResponse(
            User user
    ) {


        return new UserProfileResponse(

                user.getId(),

                user.getFullName(),

                user.getMobile(),

                user.getEmail(),

                user.getRole().name(),

                user.getState(),

                user.getDistrict(),

                user.getAddress()

        );

    }

}