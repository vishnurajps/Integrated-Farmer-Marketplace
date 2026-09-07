package com.ifmap.controller;

import com.ifmap.entity.Product;
import com.ifmap.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;


    public ProductController(ProductService productService) {

        this.productService = productService;

    }


    // ===============================
    // ADD PRODUCT
    // ===============================

    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestBody Product product
    ) {

        Product savedProduct =
                productService.addProduct(product);

        return ResponseEntity.ok(savedProduct);

    }


    // ===============================
    // GET ALL PRODUCTS
    // ===============================

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );

    }


    // ===============================
    // GET PRODUCT BY ID
    // ===============================

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id
    ) {

        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );

    }


    // ===============================
    // UPDATE PRODUCT
    // ===============================

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {

        Product updatedProduct =
                productService.updateProduct(id, product);

        return ResponseEntity.ok(updatedProduct);

    }


    // ===============================
    // DELETE PRODUCT
    // ===============================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id
    ) {

        productService.deleteProduct(id);

        return ResponseEntity.noContent().build();

    }

}