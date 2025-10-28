package MaziSheti.Controller;

import MaziSheti.Dto.VendorRegDTO;
import MaziSheti.VendorReg;
import MaziSheti.ProductCatalog;
import MaziSheti.Service.VendorRegService;
import MaziSheti.Service.ProductCatalogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "http://localhost:5173")
public class VendorRegController {

    @Autowired
    private VendorRegService vendorRegService;

    @Autowired
    private ProductCatalogService productCatalogService;

    // 1️⃣ Register new vendor
    @PostMapping("/register")
    public ResponseEntity<String> registerVendor(
            @RequestPart("vendor") VendorRegDTO vendorDTO,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        try {
            String imagePath = null;
            if (profileImage != null && !profileImage.isEmpty()) {
                imagePath = saveProfileImage(profileImage);
            }

            vendorDTO.setProfileImagePath(imagePath);
            vendorRegService.registerVendor(vendorDTO);
            return ResponseEntity.ok("Vendor registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // 2️⃣ Get all vendors
    @GetMapping("/all")
    public ResponseEntity<List<VendorReg>> getAllVendors() {
        return ResponseEntity.ok(vendorRegService.getAllVendors());
    }

    // 3️⃣ Get vendor by ID
    @GetMapping("/view/{id}")
    public ResponseEntity<VendorReg> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorRegService.getVendorById(id));
    }

    // 4️⃣ Get vendor by email
    @GetMapping("/by-email")
    public ResponseEntity<?> getVendorByEmail(@RequestParam String email) {
        VendorReg vendor = vendorRegService.getVendorByEmail(email);
        if (vendor != null) {
            return ResponseEntity.ok(vendor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5️⃣ Get all products
    @GetMapping("/products")
    public ResponseEntity<List<ProductCatalog>> getAllProducts() {
        return ResponseEntity.ok(productCatalogService.getAllProducts());
    }

    // 6️⃣ Get products for a specific vendor
    @GetMapping("/{vendorId}/products")
    public ResponseEntity<List<ProductCatalog>> getProductsByVendor(@PathVariable Long vendorId) {
        List<ProductCatalog> products = productCatalogService.getByVendor(vendorId);
        return ResponseEntity.ok(products != null ? products : List.of());
    }

    // 7️⃣ Add product for a specific vendor
    @PostMapping("/{vendorId}/add-product")
    public ResponseEntity<?> addProduct(
            @PathVariable Long vendorId,
            @RequestPart("product") ProductCatalog product,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        try {
            // Ensure vendor exists
            VendorReg vendor = vendorRegService.getVendorById(vendorId);
            if (vendor == null) {
                return ResponseEntity.badRequest().body("Vendor not found");
            }

            // Save product for vendor
            ProductCatalog savedProduct = productCatalogService.saveProductForVendor(vendor.getId(), product, image);

            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // Utility method: save vendor profile image
    private String saveProfileImage(MultipartFile file) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/uploads/vendor-images/";
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + filename;
        file.transferTo(new File(filePath));

        return "/uploads/vendor-images/" + filename;
    }
}
