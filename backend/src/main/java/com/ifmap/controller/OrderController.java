package com.ifmap.controller;

import com.ifmap.dto.CreateOrderRequest;
import com.ifmap.dto.UpdateOrderStatusRequest;

import com.ifmap.entity.Order;
import com.ifmap.entity.OrderStatus;

import com.ifmap.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {


    // ==========================================
    // SERVICE
    // ==========================================

    private final OrderService orderService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public OrderController(
            OrderService orderService
    ) {

        this.orderService = orderService;

    }


    // ==========================================
    // CREATE ORDER
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createOrder(

            @RequestBody
            CreateOrderRequest request

    ) {

        try {

            Order order =
                    orderService.createOrder(request);

            return ResponseEntity.ok(order);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }


    // ==========================================
    // GET BUYER ORDERS
    // ==========================================

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<?> getOrdersByBuyer(

            @PathVariable
            Long buyerId

    ) {

        try {

            List<Order> orders =
                    orderService.getOrdersByBuyer(
                            buyerId
                    );

            return ResponseEntity.ok(orders);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }


    // ==========================================
    // GET FARMER ORDERS
    // ==========================================

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<?> getOrdersByFarmer(

            @PathVariable
            Long farmerId

    ) {

        try {

            List<Order> orders =
                    orderService.getOrdersByFarmer(
                            farmerId
                    );

            return ResponseEntity.ok(orders);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }


    // ==========================================
    // FARMER ACCEPT / REJECT ORDER
    // ==========================================

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(

            @PathVariable
            Long orderId,

            @RequestBody
            UpdateOrderStatusRequest request

    ) {

        try {

            // ==================================
            // VALIDATE REQUEST
            // ==================================

            if (request == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Request body is required"
                        );

            }


            // ==================================
            // VALIDATE FARMER ID
            // ==================================

            if (request.getFarmerId() == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Farmer ID is required"
                        );

            }


            // ==================================
            // VALIDATE STATUS
            // ==================================

            if (request.getStatus() == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Order status is required"
                        );

            }


            // ==================================
            // ALLOW ONLY ACCEPT / REJECT
            // ==================================

            if (request.getStatus() != OrderStatus.ACCEPTED &&
                    request.getStatus() != OrderStatus.REJECTED) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Status must be ACCEPTED or REJECTED"
                        );

            }


            // ==================================
            // UPDATE ORDER
            // ==================================

            Order updatedOrder =
                    orderService.updateOrderStatus(

                            orderId,

                            request.getFarmerId(),

                            request.getStatus()

                    );


            return ResponseEntity.ok(updatedOrder);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }

}