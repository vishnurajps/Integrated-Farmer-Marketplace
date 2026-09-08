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
    // ADD PRODUCT FOR FARMER
    // ===============================

    @PostMapping("/farmer/{farmerId}")
    public ResponseEntity<Product> addProduct(

            @PathVariable Long farmerId,

            @RequestBody Product product

    ) {

        Product savedProduct =
                productService.addProduct(farmerId, product);

        return ResponseEntity.ok(savedProduct);
    }


    // ===============================
    // GET PRODUCTS BY FARMER
    // ===============================

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Product>> getProductsByFarmer(

            @PathVariable Long farmerId

    ) {

        return ResponseEntity.ok(

                productService.getProductsByFarmer(farmerId)

        );
    }


    // ===============================
    // COUNT FARMER PRODUCTS
    // ===============================

    @GetMapping("/farmer/{farmerId}/count")
    public ResponseEntity<Long> countProductsByFarmer(

            @PathVariable Long farmerId

    ) {

        return ResponseEntity.ok(

                productService.countProductsByFarmer(farmerId)

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