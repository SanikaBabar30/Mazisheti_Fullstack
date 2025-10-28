package MaziSheti.Controller;

import MaziSheti.ProductType;
import MaziSheti.Service.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/product-types")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductTypeController {

    @Autowired
    private ProductTypeService productTypeService;

    // ✅ Inject base URL (from application.properties)
    @Value("${app.base-url:http://localhost:8082}")
    private String baseUrl;

    private final String UPLOAD_DIR = "uploads/product-types/";

    // ✅ Only ADMIN can add
    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductType> addProductType(
            @RequestParam("name") String name,
            @RequestParam("image") MultipartFile imageFile) {

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = imageFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // ✅ Full image URL
            String imageUrl = baseUrl + "/uploads/product-types/" + fileName;

            // Create and save the product type in DB
            ProductType productType = new ProductType(name, imageUrl);
            return ResponseEntity.ok(productTypeService.addProductType(productType));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ Only ADMIN can update
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductType> updateProductType(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        try {
            return ResponseEntity.ok(productTypeService.updateProductTypeWithImage(id, name, imageFile));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ Only ADMIN can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProductType(@PathVariable Long id) {
        productTypeService.deleteProductType(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ✅ Both ADMIN and Vendor can view list
    @GetMapping
    public ResponseEntity<List<ProductType>> getAllProductTypes() {
        return ResponseEntity.ok(productTypeService.getAllProductTypes());
    }
}
