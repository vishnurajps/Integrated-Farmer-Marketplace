package com.ifmap.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifmap.entity.User;
import com.ifmap.entity.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    // Find user by mobile number

    Optional<User> findByMobile(String mobile);


    // Find user by email

    Optional<User> findByEmail(String email);


    // Check mobile already exists

    boolean existsByMobile(String mobile);


    // Check email already exists

    boolean existsByEmail(String email);


    // Count users by role

    long countByRole(UserRole role);

}