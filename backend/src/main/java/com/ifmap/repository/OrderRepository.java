package com.ifmap.repository;

import com.ifmap.entity.Order;
import com.ifmap.entity.OrderStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository
        extends JpaRepository<Order, Long> {


    // ==========================================
    // GET ALL ORDERS OF A BUYER
    // ==========================================

    List<Order> findByBuyerId(
            Long buyerId
    );


    // ==========================================
    // GET ALL ORDERS RECEIVED BY A FARMER
    // ==========================================

    List<Order> findByFarmerId(
            Long farmerId
    );


    // ==========================================
    // GET ORDERS OF A FARMER BY STATUS
    // ==========================================

    List<Order> findByFarmerIdAndStatus(
            Long farmerId,
            OrderStatus status
    );


    // ==========================================
    // GET ORDERS OF A BUYER BY STATUS
    // ==========================================

    List<Order> findByBuyerIdAndStatus(
            Long buyerId,
            OrderStatus status
    );

}