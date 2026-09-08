package com.ifmap.repository;

import com.ifmap.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long> {

    // Get products of a specific farmer
    List<Product> findByFarmerId(Long farmerId);

    // Count products of a specific farmer
    long countByFarmerId(Long farmerId);

    // Find a product belonging to a specific farmer
    Optional<Product> findByIdAndFarmerId(
            Long productId,
            Long farmerId
    );

    // Get ALL available products from ALL farmers
    List<Product> findByAvailabilityIgnoreCase(
            String availability
    );
}