package com.ifmap.service;

import com.ifmap.entity.Product;
import com.ifmap.entity.User;
import com.ifmap.repository.ProductRepository;
import com.ifmap.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    // ===============================
    // CONSTRUCTOR
    // ===============================

    public ProductService(
            ProductRepository productRepository,
            UserRepository userRepository
    ) {

        this.productRepository = productRepository;
        this.userRepository = userRepository;

    }


    // ===============================
    // ADD PRODUCT
    // ===============================

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


        // Assign product to farmer

        product.setFarmer(farmer);


        // Save product

        return productRepository.save(product);

    }


    // ===============================
    // GET ALL PRODUCTS BY FARMER
    // ===============================

    public List<Product> getProductsByFarmer(Long farmerId) {

        return productRepository.findByFarmerId(farmerId);

    }


    // ===============================
    // COUNT FARMER PRODUCTS
    // ===============================

    public long countProductsByFarmer(Long farmerId) {

        return productRepository.countByFarmerId(farmerId);

    }


    // ===============================
    // GET PRODUCT BY ID
    // ===============================

    public Optional<Product> getProductById(Long id) {

        return productRepository.findById(id);

    }


    // ===============================
    // UPDATE PRODUCT
    // ===============================

    public Product updateProduct(
            Long id,
            Product updatedProduct
    ) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with ID: " + id
                        )
                );


        // Update product details

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


        // Save updated product

        return productRepository.save(product);

    }


    // ===============================
    // DELETE PRODUCT
    // ===============================

    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {

            throw new RuntimeException(
                    "Product not found with ID: " + id
            );

        }


        productRepository.deleteById(id);

    }

}