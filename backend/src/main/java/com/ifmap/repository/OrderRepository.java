package com.ifmap.repository;

import com.ifmap.entity.Order;
import com.ifmap.entity.OrderStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ==========================================
    // GET ALL ORDERS OF A BUYER
    // ==========================================

    List<Order> findByBuyerIdOrderByOrderDateDesc(
            Long buyerId
    );


    // ==========================================
    // GET ALL ORDERS RECEIVED BY A FARMER
    // ==========================================

    List<Order> findByFarmerIdOrderByOrderDateDesc(
            Long farmerId
    );


    // ==========================================
    // GET FARMER ORDERS BY STATUS
    // ==========================================

    List<Order> findByFarmerIdAndStatusOrderByOrderDateDesc(
            Long farmerId,
            OrderStatus status
    );


    // ==========================================
    // GET BUYER ORDERS BY STATUS
    // ==========================================

    List<Order> findByBuyerIdAndStatusOrderByOrderDateDesc(
            Long buyerId,
            OrderStatus status
    );

}