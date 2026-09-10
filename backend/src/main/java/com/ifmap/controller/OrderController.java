package com.ifmap.controller;

import com.ifmap.dto.CreateOrderRequest;
import com.ifmap.entity.Order;
import com.ifmap.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {


    private final OrderService orderService;


    public OrderController(
            OrderService orderService
    ) {

        this.orderService = orderService;

    }


    // ==========================================
    // CREATE ORDER
    // ==========================================

    @PostMapping
    public ResponseEntity<Order> createOrder(

            @RequestBody
            CreateOrderRequest request

    ) {

        Order order =
                orderService.createOrder(request);


        return ResponseEntity.ok(order);

    }


    // ==========================================
    // GET BUYER ORDERS
    // ==========================================

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<Order>> getOrdersByBuyer(

            @PathVariable
            Long buyerId

    ) {

        List<Order> orders =
                orderService.getOrdersByBuyer(
                        buyerId
                );


        return ResponseEntity.ok(orders);

    }


    // ==========================================
    // GET FARMER ORDERS
    // ==========================================

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Order>> getOrdersByFarmer(

            @PathVariable
            Long farmerId

    ) {

        List<Order> orders =
                orderService.getOrdersByFarmer(
                        farmerId
                );


        return ResponseEntity.ok(orders);

    }

}