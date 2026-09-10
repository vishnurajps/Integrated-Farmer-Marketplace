package com.ifmap.dto;

public class CreateOrderRequest {

    private Long productId;

    private Long buyerId;

    private Double quantity;


    // ==========================
    // GETTERS AND SETTERS
    // ==========================

    public Long getProductId() {

        return productId;

    }


    public void setProductId(Long productId) {

        this.productId = productId;

    }


    public Long getBuyerId() {

        return buyerId;

    }


    public void setBuyerId(Long buyerId) {

        this.buyerId = buyerId;

    }


    public Double getQuantity() {

        return quantity;

    }


    public void setQuantity(Double quantity) {

        this.quantity = quantity;

    }

}