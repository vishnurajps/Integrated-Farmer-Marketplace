package com.ifmap.statistics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifmap.dto.StatisticsResponse;
import com.ifmap.entity.UserRole;
import com.ifmap.repository.UserRepository;

@Service
public class StatisticsService {

    @Autowired
    private UserRepository userRepository;

    public StatisticsResponse getStatistics() {

        long farmers =
                userRepository.countByRole(UserRole.FARMER);

        long buyers =
                userRepository.countByRole(UserRole.BUYER);

        long advisors =
                userRepository.countByRole(UserRole.ADVISOR);

        // Product count will be connected after products table/entity is created
        long products = 0;

        return new StatisticsResponse(
                farmers,
                buyers,
                advisors,
                products
        );
    }
}