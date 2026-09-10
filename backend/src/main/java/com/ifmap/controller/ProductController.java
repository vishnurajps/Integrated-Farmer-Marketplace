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


    // ==========================================
    // ADD PRODUCT FOR A FARMER
    // ==========================================

    @PostMapping("/farmer/{farmerId}")
    public ResponseEntity<Product> addProduct(

            @PathVariable Long farmerId,

            @RequestBody Product product

    ) {

        Product savedProduct =
                productService.addProduct(
                        farmerId,
                        product
                );

        return ResponseEntity.ok(savedProduct);

    }


    // ==========================================
    // GET AVAILABLE PRODUCTS
    // BUYER MARKETPLACE
    // ==========================================

    @GetMapping("/available")
    public ResponseEntity<List<Product>> getAvailableProducts() {

        return ResponseEntity.ok(
                productService.getAvailableProducts()
        );

    }


    // ==========================================
    // GET ALL PRODUCTS OF A FARMER
    // ==========================================

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Product>> getProductsByFarmer(

            @PathVariable Long farmerId

    ) {

        return ResponseEntity.ok(
                productService.getProductsByFarmer(
                        farmerId
                )
        );

    }


    // ==========================================
    // GET ONE PRODUCT FOR EDITING
    // ==========================================

    @GetMapping("/{productId}/farmer/{farmerId}")
    public ResponseEntity<Product> getProductByIdAndFarmer(

            @PathVariable Long productId,

            @PathVariable Long farmerId

    ) {

        return productService
                .getProductByIdAndFarmer(
                        productId,
                        farmerId
                )
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );

    }


    // ==========================================
    // UPDATE PRODUCT
    // ==========================================

    @PutMapping("/{productId}/farmer/{farmerId}")
    public ResponseEntity<Product> updateProduct(

            @PathVariable Long productId,

            @PathVariable Long farmerId,

            @RequestBody Product product

    ) {

        Product updatedProduct =
                productService.updateProduct(
                        productId,
                        farmerId,
                        product
                );

        return ResponseEntity.ok(updatedProduct);

    }


    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    @DeleteMapping("/{productId}/farmer/{farmerId}")
    public ResponseEntity<Void> deleteProduct(

            @PathVariable Long productId,

            @PathVariable Long farmerId

    ) {

        productService.deleteProduct(
                productId,
                farmerId
        );

        return ResponseEntity.noContent().build();

    }
    
 // ==========================================
 // GET SINGLE PRODUCT BY ID
 // BUYER PRODUCT DETAILS
 // ==========================================

 @GetMapping("/{productId}")
 public ResponseEntity<Product> getProductById(
         @PathVariable Long productId
 ) {

     return productService
             .getProductById(productId)
             .map(ResponseEntity::ok)
             .orElse(
                     ResponseEntity.notFound().build()
             );

 }
 
 

}