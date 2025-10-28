package MaziSheti.Controller;

import MaziSheti.Dto.VendorRegDTO;
import MaziSheti.VendorReg;
import MaziSheti.Service.VendorRegService;

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

    // ✅ 1. Register new vendor
    @PostMapping("/register")
    public ResponseEntity<String> registerVendor(
            @RequestPart("vendor") VendorRegDTO vendorDTO,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        try {
            String imagePath = null;
            if (profileImage != null && !profileImage.isEmpty()) {
                imagePath = saveProfileImage(profileImage);
            }

            vendorDTO.setProfileImagePath(imagePath); // set web-accessible path
            vendorRegService.registerVendor(vendorDTO);
            return ResponseEntity.ok("Vendor registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ✅ 2. Get all vendors
    @GetMapping("/all")
    public ResponseEntity<List<VendorReg>> getAllVendors() {
        return ResponseEntity.ok(vendorRegService.getAllVendors());
    }

    // ✅ 3. Get vendor by ID
    @GetMapping("/view/{id}")
    public ResponseEntity<VendorReg> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorRegService.getVendorById(id));
    }

    // ✅ Save image and return accessible path
    private String saveProfileImage(MultipartFile file) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/uploads/vendor-images/";
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + filename;
        file.transferTo(new File(filePath));

        // ✅ Return web path (for frontend use)
        return "/uploads/vendor-images/" + filename;
    }
}
