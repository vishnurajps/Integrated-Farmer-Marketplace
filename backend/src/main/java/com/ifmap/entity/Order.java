package com.ifmap.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    // ==========================================
    // ID
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // PRODUCT
    // ==========================================

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;


    // ==========================================
    // BUYER
    // ==========================================

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;


    // ==========================================
    // FARMER
    // ==========================================

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;


    // ==========================================
    // QUANTITY
    // ==========================================

    private Double quantity;


    // ==========================================
    // PRICE PER UNIT
    // ==========================================

    private Double pricePerUnit;


    // ==========================================
    // TOTAL PRICE
    // ==========================================

    private Double totalPrice;


    // ==========================================
    // ORDER STATUS
    // ==========================================

    @Enumerated(EnumType.STRING)
    private OrderStatus status;


    // ==========================================
    // ORDER DATE
    // ==========================================

    private LocalDateTime orderDate;


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }


    public User getBuyer() {
        return buyer;
    }

    public void setBuyer(User buyer) {
        this.buyer = buyer;
    }


    public User getFarmer() {
        return farmer;
    }

    public void setFarmer(User farmer) {
        this.farmer = farmer;
    }


    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }


    public Double getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(Double pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }


    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }


    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }


    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
}