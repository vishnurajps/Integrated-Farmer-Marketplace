package com.ifmap.dto;

import com.ifmap.entity.OrderStatus;

public class UpdateOrderStatusRequest {

    private Long farmerId;

    private OrderStatus status;


    // ==========================================
    // GET FARMER ID
    // ==========================================

    public Long getFarmerId() {

        return farmerId;

    }


    // ==========================================
    // SET FARMER ID
    // ==========================================

    public void setFarmerId(Long farmerId) {

        this.farmerId = farmerId;

    }


    // ==========================================
    // GET STATUS
    // ==========================================

    public OrderStatus getStatus() {

        return status;

    }


    // ==========================================
    // SET STATUS
    // ==========================================

    public void setStatus(OrderStatus status) {

        this.status = status;

    }

}