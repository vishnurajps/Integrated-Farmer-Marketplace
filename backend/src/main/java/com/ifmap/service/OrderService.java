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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class OrderService {


    // ==========================================
    // REPOSITORIES
    // ==========================================

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

        this.orderRepository = orderRepository;

        this.productRepository = productRepository;

        this.userRepository = userRepository;

    }


    // ==========================================
    // CREATE ORDER
    // ==========================================

    @Transactional
    public Order createOrder(
            CreateOrderRequest request
    ) {


        // ======================================
        // VALIDATE REQUEST
        // ======================================

        if (request == null) {

            throw new RuntimeException(
                    "Order request is required"
            );

        }


        // ======================================
        // VALIDATE PRODUCT ID
        // ======================================

        if (request.getProductId() == null) {

            throw new RuntimeException(
                    "Product ID is required"
            );

        }


        // ======================================
        // VALIDATE BUYER ID
        // ======================================

        if (request.getBuyerId() == null) {

            throw new RuntimeException(
                    "Buyer ID is required"
            );

        }


        // ======================================
        // VALIDATE QUANTITY
        // ======================================

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
                .findById(request.getBuyerId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Buyer not found"
                        )
                );


        // ======================================
        // VERIFY BUYER ROLE
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
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        )
                );


        // ======================================
        // CHECK AVAILABILITY
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
        // CHECK REQUESTED QUANTITY
        // ======================================

        if (request.getQuantity() >
                product.getQuantity()) {

            throw new RuntimeException(
                    "Requested quantity is greater than available stock"
            );

        }


        // ======================================
        // GET FARMER
        // ======================================

        User farmer = product.getFarmer();


        if (farmer == null) {

            throw new RuntimeException(
                    "Farmer information is not available"
            );

        }


        // ======================================
        // VERIFY FARMER ROLE
        // ======================================

        if (farmer.getRole() != UserRole.FARMER) {

            throw new RuntimeException(
                    "Invalid farmer assigned to product"
            );

        }


        // ======================================
        // VALIDATE PRODUCT PRICE
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
    // GET BUYER ORDERS
    // ==========================================

    public List<Order> getOrdersByBuyer(
            Long buyerId
    ) {


        if (buyerId == null) {

            throw new RuntimeException(
                    "Buyer ID is required"
            );

        }


        User buyer = userRepository
                .findById(buyerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Buyer not found"
                        )
                );


        if (buyer.getRole() != UserRole.BUYER) {

            throw new RuntimeException(
                    "User is not a buyer"
            );

        }


        return orderRepository
                .findByBuyerIdOrderByOrderDateDesc(
                        buyerId
                );

    }


    // ==========================================
    // GET FARMER ORDERS
    // ==========================================

    public List<Order> getOrdersByFarmer(
            Long farmerId
    ) {


        if (farmerId == null) {

            throw new RuntimeException(
                    "Farmer ID is required"
            );

        }


        User farmer = userRepository
                .findById(farmerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Farmer not found"
                        )
                );


        if (farmer.getRole() != UserRole.FARMER) {

            throw new RuntimeException(
                    "User is not a farmer"
            );

        }


        return orderRepository
                .findByFarmerIdOrderByOrderDateDesc(
                        farmerId
                );

    }


    // ==========================================
    // ACCEPT OR REJECT ORDER
    // ==========================================

    @Transactional
    public Order updateOrderStatus(

            Long orderId,

            Long farmerId,

            OrderStatus newStatus

    ) {


        // ======================================
        // VALIDATE ORDER ID
        // ======================================

        if (orderId == null) {

            throw new RuntimeException(
                    "Order ID is required"
            );

        }


        // ======================================
        // VALIDATE FARMER ID
        // ======================================

        if (farmerId == null) {

            throw new RuntimeException(
                    "Farmer ID is required"
            );

        }


        // ======================================
        // VALIDATE STATUS
        // ======================================

        if (newStatus == null) {

            throw new RuntimeException(
                    "Order status is required"
            );

        }


        // ======================================
        // ALLOW ONLY ACCEPT / REJECT
        // ======================================

        if (newStatus != OrderStatus.ACCEPTED &&
                newStatus != OrderStatus.REJECTED) {

            throw new RuntimeException(
                    "Farmer can only ACCEPT or REJECT an order"
            );

        }


        // ======================================
        // FIND FARMER
        // ======================================

        User farmer = userRepository
                .findById(farmerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Farmer not found"
                        )
                );


        // ======================================
        // VERIFY FARMER ROLE
        // ======================================

        if (farmer.getRole() != UserRole.FARMER) {

            throw new RuntimeException(
                    "Only farmers can update orders"
            );

        }


        // ======================================
        // FIND ORDER
        // ======================================

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );


        // ======================================
        // VERIFY ORDER BELONGS TO FARMER
        // ======================================

        if (order.getFarmer() == null ||
                order.getFarmer().getId() == null ||
                !order.getFarmer()
                        .getId()
                        .equals(farmerId)) {

            throw new RuntimeException(
                    "You do not have permission to update this order"
            );

        }


        // ======================================
        // ONLY PENDING ORDERS CAN CHANGE
        // ======================================

        if (order.getStatus() != OrderStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending orders can be accepted or rejected"
            );

        }


        // ======================================
        // ACCEPT ORDER
        // ======================================

        if (newStatus == OrderStatus.ACCEPTED) {


            // ==================================
            // GET PRODUCT
            // ==================================

            if (order.getProduct() == null ||
                    order.getProduct().getId() == null) {

                throw new RuntimeException(
                        "Product information is missing"
                );

            }


            // ==================================
            // LOAD CURRENT PRODUCT
            // ==================================

            Product product = productRepository
                    .findById(
                            order.getProduct().getId()
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found"
                            )
                    );


            // ==================================
            // VALIDATE ORDER QUANTITY
            // ==================================

            if (order.getQuantity() == null ||
                    order.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Invalid order quantity"
                );

            }


            // ==================================
            // CHECK AVAILABLE STOCK
            // ==================================

            if (product.getQuantity() == null ||
                    product.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Product is out of stock"
                );

            }


            // ==================================
            // CHECK STOCK
            // ==================================

            if (product.getQuantity() <
                    order.getQuantity()) {

                throw new RuntimeException(

                        "Insufficient stock. Available: "

                                + product.getQuantity()

                                + " "

                                + product.getUnit()

                                + ", Required: "

                                + order.getQuantity()

                                + " "

                                + product.getUnit()

                );

            }


            // ==================================
            // CALCULATE REMAINING QUANTITY
            // ==================================

            Double remainingQuantity =

                    product.getQuantity()
                            - order.getQuantity();


            // ==================================
            // UPDATE PRODUCT QUANTITY
            // ==================================

            product.setQuantity(
                    remainingQuantity
            );


            // ==================================
            // UPDATE AVAILABILITY
            // ==================================

            if (remainingQuantity <= 0) {

                product.setQuantity(0.0);

                product.setAvailability(
                        "Unavailable"
                );

            } else {

                product.setAvailability(
                        "Available"
                );

            }


            // ==================================
            // SAVE PRODUCT
            // ==================================

            productRepository.save(product);

        }


        // ======================================
        // REJECT ORDER
        // ======================================

        // If rejected, product quantity is NOT changed.


        // ======================================
        // UPDATE ORDER STATUS
        // ======================================

        order.setStatus(newStatus);


        // ======================================
        // SAVE ORDER
        // ======================================

        return orderRepository.save(order);

    }

}