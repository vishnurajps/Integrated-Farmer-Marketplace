package com.ifmap.dto;

public class StatisticsResponse {

    private long farmers;
    private long buyers;
    private long advisors;
    private long products;

    public StatisticsResponse() {
    }

    public StatisticsResponse(
            long farmers,
            long buyers,
            long advisors,
            long products) {

        this.farmers = farmers;
        this.buyers = buyers;
        this.advisors = advisors;
        this.products = products;
    }

    public long getFarmers() {
        return farmers;
    }

    public void setFarmers(long farmers) {
        this.farmers = farmers;
    }

    public long getBuyers() {
        return buyers;
    }

    public void setBuyers(long buyers) {
        this.buyers = buyers;
    }

    public long getAdvisors() {
        return advisors;
    }

    public void setAdvisors(long advisors) {
        this.advisors = advisors;
    }

    public long getProducts() {
        return products;
    }

    public void setProducts(long products) {
        this.products = products;
    }
}