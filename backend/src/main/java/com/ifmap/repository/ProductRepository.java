package com.ifmap.repository;

import com.ifmap.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long> {

    // Get products belonging to one farmer
    List<Product> findByFarmerId(Long farmerId);

    // Count products belonging to one farmer
    long countByFarmerId(Long farmerId);

}