package com.ifmap.service;

import com.ifmap.dto.CreateOrderRequest;
import com.ifmap.entity.Order;
import com.ifmap.entity.OrderStatus;
import com.ifmap.entity.Product;
import com.ifmap.entity.User;
import com.ifmap.entity.UserRole;
import com.ifmap.repository.OrderRepository;
import com.ifmap.repository.ProductRepository;
import com.ifmap.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public OrderService(

            OrderRepository orderRepository,

            ProductRepository productRepository,

            UserRepository userRepository

    ) {

        this.orderRepository =
                orderRepository;

        this.productRepository =
                productRepository;

        this.userRepository =
                userRepository;

    }


    // ==========================================
    // CREATE ORDER
    // ==========================================

    public Order createOrder(
            CreateOrderRequest request
    ) {

        // ======================================
        // VALIDATE REQUEST
        // ======================================

        if (request.getProductId() == null) {

            throw new RuntimeException(
                    "Product ID is required"
            );

        }


        if (request.getBuyerId() == null) {

            throw new RuntimeException(
                    "Buyer ID is required"
            );

        }


        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Order quantity must be greater than zero"
            );

        }


        // ======================================
        // FIND BUYER
        // ======================================

        User buyer = userRepository
                .findById(
                        request.getBuyerId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Buyer not found"
                        )
                );


        // ======================================
        // VERIFY USER ROLE
        // ======================================

        if (buyer.getRole() != UserRole.BUYER) {

            throw new RuntimeException(
                    "Only buyers can place orders"
            );

        }


        // ======================================
        // FIND PRODUCT
        // ======================================

        Product product = productRepository
                .findById(
                        request.getProductId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        )
                );


        // ======================================
        // CHECK PRODUCT AVAILABILITY
        // ======================================

        if (product.getAvailability() == null ||

                !product.getAvailability()
                        .equalsIgnoreCase("Available")) {

            throw new RuntimeException(
                    "This product is currently unavailable"
            );

        }


        // ======================================
        // CHECK PRODUCT QUANTITY
        // ======================================

        if (product.getQuantity() == null ||
                product.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Product is out of stock"
            );

        }


        // ======================================
        // CHECK ORDER QUANTITY
        // ======================================

        if (request.getQuantity() >
                product.getQuantity()) {

            throw new RuntimeException(
                    "Requested quantity is greater than available stock"
            );

        }


        // ======================================
        // GET FARMER FROM PRODUCT
        // ======================================

        User farmer =
                product.getFarmer();


        if (farmer == null) {

            throw new RuntimeException(
                    "Farmer information is not available"
            );

        }


        // ======================================
        // CHECK PRICE
        // ======================================

        if (product.getPrice() == null ||
                product.getPrice() <= 0) {

            throw new RuntimeException(
                    "Invalid product price"
            );

        }


        // ======================================
        // CALCULATE TOTAL PRICE
        // ======================================

        Double totalPrice =
                product.getPrice()
                        * request.getQuantity();


        // ======================================
        // CREATE ORDER
        // ======================================

        Order order = new Order();


        order.setProduct(product);

        order.setBuyer(buyer);

        order.setFarmer(farmer);

        order.setQuantity(
                request.getQuantity()
        );

        order.setPricePerUnit(
                product.getPrice()
        );

        order.setTotalPrice(
                totalPrice
        );

        order.setStatus(
                OrderStatus.PENDING
        );

        order.setOrderDate(
                LocalDateTime.now()
        );


        // ======================================
        // SAVE ORDER
        // ======================================

        return orderRepository.save(order);

    }


    // ==========================================
    // GET ORDERS OF BUYER
    // ==========================================

    public List<Order> getOrdersByBuyer(
            Long buyerId
    ) {

        return orderRepository
                .findByBuyerId(buyerId);

    }


    // ==========================================
    // GET ORDERS RECEIVED BY FARMER
    // ==========================================

    public List<Order> getOrdersByFarmer(
            Long farmerId
    ) {

        return orderRepository
                .findByFarmerId(farmerId);

    }

} 