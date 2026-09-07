package com.ifmap.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifmap.dto.StatisticsResponse;
import com.ifmap.entity.UserRole;
import com.ifmap.repository.UserRepository;

@RestController
@CrossOrigin(origins = "*")
public class StatisticsController {


    @Autowired
    private UserRepository userRepository;


    @GetMapping("/api/statistics")
    public StatisticsResponse getStatistics() {


        // Count Farmers

        long farmers =
                userRepository.countByRole(UserRole.FARMER);


        // Count Buyers

        long buyers =
                userRepository.countByRole(UserRole.BUYER);


        // Count Advisors

        long advisors =
                userRepository.countByRole(UserRole.ADVISOR);


        // Product module is not implemented yet

        long products = 0;


        return new StatisticsResponse(

                farmers,
                buyers,
                advisors,
                products

        );

    }

}