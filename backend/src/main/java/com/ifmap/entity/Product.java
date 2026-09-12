package com.ifmap.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "products")
public class Product {


    // ==========================================
    // ID
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // PRODUCT DETAILS
    // ==========================================

    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private String category;


    // Available stock quantity
    private Double quantity;


    private String unit;


    private Double price;


    private LocalDate harvestDate;


    private String location;


    @Column(length = 1000)
    private String description;


    // Available / Unavailable
    private String availability;


    @Column(columnDefinition = "TEXT")
    private String imageUrl;


    // ==========================================
    // FARMER RELATIONSHIP
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)

    @JsonIgnoreProperties({
            "password",
            "createdAt",
            "updatedAt"
    })

    private User farmer;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Product() {

    }


    // ==========================================
    // ID
    // ==========================================

    public Long getId() {

        return id;

    }


    public void setId(Long id) {

        this.id = id;

    }


    // ==========================================
    // NAME
    // ==========================================

    public String getName() {

        return name;

    }


    public void setName(String name) {

        this.name = name;

    }


    // ==========================================
    // CATEGORY
    // ==========================================

    public String getCategory() {

        return category;

    }


    public void setCategory(String category) {

        this.category = category;

    }


    // ==========================================
    // QUANTITY
    // ==========================================

    public Double getQuantity() {

        return quantity;

    }


    public void setQuantity(Double quantity) {

        this.quantity = quantity;

    }


    // ==========================================
    // UNIT
    // ==========================================

    public String getUnit() {

        return unit;

    }


    public void setUnit(String unit) {

        this.unit = unit;

    }


    // ==========================================
    // PRICE
    // ==========================================

    public Double getPrice() {

        return price;

    }


    public void setPrice(Double price) {

        this.price = price;

    }


    // ==========================================
    // HARVEST DATE
    // ==========================================

    public LocalDate getHarvestDate() {

        return harvestDate;

    }


    public void setHarvestDate(LocalDate harvestDate) {

        this.harvestDate = harvestDate;

    }


    // ==========================================
    // LOCATION
    // ==========================================

    public String getLocation() {

        return location;

    }


    public void setLocation(String location) {

        this.location = location;

    }


    // ==========================================
    // DESCRIPTION
    // ==========================================

    public String getDescription() {

        return description;

    }


    public void setDescription(String description) {

        this.description = description;

    }


    // ==========================================
    // AVAILABILITY
    // ==========================================

    public String getAvailability() {

        return availability;

    }


    public void setAvailability(String availability) {

        this.availability = availability;

    }


    // ==========================================
    // IMAGE URL
    // ==========================================

    public String getImageUrl() {

        return imageUrl;

    }


    public void setImageUrl(String imageUrl) {

        this.imageUrl = imageUrl;

    }


    // ==========================================
    // FARMER
    // ==========================================

    public User getFarmer() {

        return farmer;

    }


    public void setFarmer(User farmer) {

        this.farmer = farmer;

    }

}