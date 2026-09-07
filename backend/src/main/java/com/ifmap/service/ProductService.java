package com.ifmap.service;

import com.ifmap.entity.Product;
import com.ifmap.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ===============================
    // ADD PRODUCT
    // ===============================

    public Product addProduct(Product product) {

        return productRepository.save(product);

    }


    // ===============================
    // GET ALL PRODUCTS
    // ===============================

    public List<Product> getAllProducts() {

        return productRepository.findAll();

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

    public Product updateProduct(Long id, Product updatedProduct) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with ID: " + id)
                );

        product.setName(updatedProduct.getName());
        product.setCategory(updatedProduct.getCategory());
        product.setQuantity(updatedProduct.getQuantity());
        product.setUnit(updatedProduct.getUnit());
        product.setPrice(updatedProduct.getPrice());
        product.setHarvestDate(updatedProduct.getHarvestDate());
        product.setLocation(updatedProduct.getLocation());
        product.setDescription(updatedProduct.getDescription());
        product.setAvailability(updatedProduct.getAvailability());
        product.setImageUrl(updatedProduct.getImageUrl());

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