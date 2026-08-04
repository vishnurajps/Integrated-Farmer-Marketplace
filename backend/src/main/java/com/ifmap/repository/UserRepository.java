package com.ifmap.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifmap.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by mobile number
    Optional<User> findByMobile(String mobile);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Check if mobile already exists
    boolean existsByMobile(String mobile);

    // Check if email already exists
    boolean existsByEmail(String email);

}