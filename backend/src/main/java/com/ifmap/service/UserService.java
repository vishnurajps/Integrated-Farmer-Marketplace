package com.ifmap.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifmap.dto.LoginRequest;
import com.ifmap.dto.LoginResponse;
import com.ifmap.dto.RegisterRequest;
import com.ifmap.entity.User;
import com.ifmap.entity.UserRole;
import com.ifmap.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ==========================
    // Register User
    // ==========================
    public String registerUser(RegisterRequest request) {

        if (userRepository.existsByMobile(request.getMobile())) {
            return "Mobile number already registered";
        }

        if (request.getEmail() != null
                && !request.getEmail().isBlank()
                && userRepository.existsByEmail(request.getEmail())) {

            return "Email already registered";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setMobile(request.getMobile());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        user.setState(request.getState());
        user.setDistrict(request.getDistrict());
        user.setAddress(request.getAddress());
        user.setCertificateNumber(request.getCertificateNumber());

        if (request.getRole() == UserRole.ADVISOR) {
            user.setIsVerified(false);
        } else {
            user.setIsVerified(true);
        }

        userRepository.save(user);

        return "Registration Successful";
    }

    // ==========================
    // Login User
    // ==========================
    public LoginResponse loginUser(LoginRequest request) {

        Optional<User> userOptional = userRepository.findByMobile(request.getMobile());

        if (userOptional.isEmpty()) {
            return new LoginResponse("Mobile number not registered", "");
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(request.getPassword())) {
            return new LoginResponse("Incorrect Password", "");
        }

        return new LoginResponse(
                "Login Successful",
                user.getRole().name()
        );
    }
}