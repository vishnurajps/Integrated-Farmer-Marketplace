package com.ifmap.controller;

import com.ifmap.dto.CreateOrderRequest;
import com.ifmap.entity.Order;
import com.ifmap.entity.OrderStatus;
import com.ifmap.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {


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


    // ==========================================
    // FARMER ACCEPT / REJECT ORDER
    // ==========================================

    @PutMapping(
            "/{orderId}/farmer/{farmerId}/status"
    )
    public ResponseEntity<Order> updateOrderStatus(

            @PathVariable
            Long orderId,

            @PathVariable
            Long farmerId,

            @RequestParam
            OrderStatus status

    ) {

        Order updatedOrder =
                orderService.updateOrderStatus(

                        orderId,
                        farmerId,
                        status

                );

        return ResponseEntity.ok(
                updatedOrder
        );

    }
    
 // ==========================================
 // FARMER ACCEPT / REJECT ORDER
 // ==========================================

 @PutMapping("/{orderId}/status")
 public ResponseEntity<Order> updateOrderStatus(

         @PathVariable
         Long orderId,

         @RequestBody
         Map<String, String> request

 ) {

     // Get logged-in farmer ID

     Long farmerId =
             Long.parseLong(
                     request.get("farmerId")
             );


     // Get new status

     OrderStatus newStatus =
             OrderStatus.valueOf(
                     request.get("status")
                             .toUpperCase()
             );


     // Update order

     Order updatedOrder =
             orderService.updateOrderStatus(
                     orderId,
                     farmerId,
                     newStatus
             );


     return ResponseEntity.ok(
             updatedOrder
     );

 }

}