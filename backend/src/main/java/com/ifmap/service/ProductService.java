package com.ifmap.service;

import com.ifmap.entity.Product;
import com.ifmap.entity.User;
import com.ifmap.entity.UserRole;
import com.ifmap.repository.ProductRepository;
import com.ifmap.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(
            ProductRepository productRepository,
            UserRepository userRepository
    ) {

        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    public Product addProduct(
            Long farmerId,
            Product product
    ) {

        User farmer = userRepository
                .findById(farmerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Farmer not found with ID: " + farmerId
                        )
                );


        // Only FARMER can add products

        if (farmer.getRole() != UserRole.FARMER) {

            throw new RuntimeException(
                    "Only farmers can add products"
            );

        }


        product.setFarmer(farmer);

        return productRepository.save(product);

    }


    // ==========================================
    // GET PRODUCTS OF ONE FARMER
    // ==========================================

    public List<Product> getProductsByFarmer(
            Long farmerId
    ) {

        return productRepository
                .findByFarmerId(farmerId);

    }


    // ==========================================
    // GET ALL AVAILABLE PRODUCTS
    // FROM ALL FARMERS
    // ==========================================

    public List<Product> getAvailableProducts() {

        return productRepository
                .findByAvailabilityIgnoreCase(
                        "Available"
                );

    }


    // ==========================================
    // GET ONE PRODUCT
    // ==========================================

    public Optional<Product> getProductByIdAndFarmer(
            Long productId,
            Long farmerId
    ) {

        return productRepository
                .findByIdAndFarmerId(
                        productId,
                        farmerId
                );

    }


    // ==========================================
    // COUNT FARMER PRODUCTS
    // ==========================================

    public long countProductsByFarmer(
            Long farmerId
    ) {

        return productRepository
                .countByFarmerId(farmerId);

    }


    // ==========================================
    // UPDATE PRODUCT
    // ==========================================

    public Product updateProduct(
            Long productId,
            Long farmerId,
            Product updatedProduct
    ) {

        Product product = productRepository
                .findByIdAndFarmerId(
                        productId,
                        farmerId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found or permission denied"
                        )
                );


        product.setName(updatedProduct.getName());

        product.setCategory(updatedProduct.getCategory());

        product.setQuantity(updatedProduct.getQuantity());

        product.setUnit(updatedProduct.getUnit());

        product.setPrice(updatedProduct.getPrice());

        product.setHarvestDate(
                updatedProduct.getHarvestDate()
        );

        product.setLocation(
                updatedProduct.getLocation()
        );

        product.setDescription(
                updatedProduct.getDescription()
        );

        product.setAvailability(
                updatedProduct.getAvailability()
        );

        product.setImageUrl(
                updatedProduct.getImageUrl()
        );


        return productRepository.save(product);

    }


    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    public void deleteProduct(
            Long productId,
            Long farmerId
    ) {

        Product product = productRepository
                .findByIdAndFarmerId(
                        productId,
                        farmerId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found or permission denied"
                        )
                );


        productRepository.delete(product);

    }

}