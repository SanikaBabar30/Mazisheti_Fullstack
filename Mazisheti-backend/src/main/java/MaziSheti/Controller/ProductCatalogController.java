package MaziSheti.Controller;

import MaziSheti.ProductCatalog;
import MaziSheti.Service.ProductCatalogService;
import MaziSheti.Service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductCatalogController {

    private final ProductCatalogService productCatalogService;
    private final NotificationService notificationService;

    public ProductCatalogController(ProductCatalogService productCatalogService,
                                    NotificationService notificationService) {
        this.productCatalogService = productCatalogService;
        this.notificationService = notificationService;
    }

    // ===================== CATEGORY ENDPOINTS =====================

    // Get all unique product categories
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(productCatalogService.getAllCategories());
    }

    // Get products by category name
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductCatalog>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productCatalogService.getByCategory(category));
    }

    // ===================== PRODUCT ENDPOINTS =====================

    // Get all products
    @GetMapping
    public ResponseEntity<List<ProductCatalog>> getAllProducts() {
        return ResponseEntity.ok(productCatalogService.getAllProducts());
    }

    // Get a single product by ID
    @GetMapping("/{productId}")
    public ResponseEntity<ProductCatalog> getProductById(@PathVariable Long productId) {
        ProductCatalog product = productCatalogService.getProductById(productId);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }

    // Get products by vendor ID
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<ProductCatalog>> getByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(productCatalogService.getByVendor(vendorId));
    }

    // ===================== ADMIN / VENDOR PRODUCT MANAGEMENT =====================

    // 🟢 Add a new product for a vendor
    @PostMapping(value = "/vendor/{vendorId}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> addProductByVendor(
            @PathVariable Long vendorId,
            @RequestPart("product") ProductCatalog product,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        try {
            if (product.getProductType() == null || product.getProductType().isEmpty()) {
                product.setProductType("Uncategorized");
            }

            ProductCatalog savedProduct = productCatalogService.saveProductForVendor(vendorId, product, image);

            // 🔔 Notify admins
            notificationService.notifyAdmin("🛒 Vendor (ID: " + vendorId + ") added a new product: " + product.getProductName());

            return ResponseEntity.ok(savedProduct);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while uploading product image");
        }
    }

    // 🟢 Add a new product by admin
    @PostMapping(value = "/admin", consumes = {"multipart/form-data"})
    public ResponseEntity<?> addProductByAdmin(
            @RequestPart("product") ProductCatalog product,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        try {
            if (product.getProductType() == null || product.getProductType().isEmpty()) {
                product.setProductType("Uncategorized");
            }

            ProductCatalog savedProduct = productCatalogService.saveProduct(product, image);

            // 🔔 Notify admins
            notificationService.notifyAdmin("✅ Admin added new product: " + product.getProductName());

            return ResponseEntity.ok(savedProduct);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while uploading product image");
        }
    }

    // 🟡 Update an existing product
    @PutMapping(value = "/{productId}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateProduct(
            @PathVariable Long productId,
            @RequestPart("product") ProductCatalog updatedProduct,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        try {
            ProductCatalog existingProduct = productCatalogService.getProductById(productId);
            if (existingProduct == null) {
                return ResponseEntity.notFound().build();
            }

            ProductCatalog updated = productCatalogService.updateProduct(productId, updatedProduct, image);

            // 🔔 Notify admin about update
            notificationService.notifyAdmin("✏️ Product updated: " + updated.getProductName());

            return ResponseEntity.ok(updated);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while updating product image");
        }
    }

    // 🔴 Delete a product
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        ProductCatalog existingProduct = productCatalogService.getProductById(productId);
        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }

        productCatalogService.deleteProduct(productId);

        // 🔔 Notify admins
        notificationService.notifyAdmin("🗑️ Product deleted: " + existingProduct.getProductName());

        return ResponseEntity.noContent().build();
    }

    // ===================== PRODUCT STATUS MANAGEMENT =====================

    // 🚫 Disable a vendor product
    @PutMapping("/disable/{productId}")
    public ResponseEntity<String> disableProduct(@PathVariable Long productId) {
        ProductCatalog product = productCatalogService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        product.setAvailable(false);
        try {
            productCatalogService.saveProduct(product, null);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while disabling product");
        }

        // 🔔 Notify admin
        notificationService.notifyAdmin("🚫 Product disabled by Admin: " + product.getProductName());

        return ResponseEntity.ok("Product disabled successfully");
    }
}
