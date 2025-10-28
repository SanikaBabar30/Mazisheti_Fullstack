package MaziSheti.Controller;

import MaziSheti.Service.ExcelSeedTypeService;
import MaziSheti.Service.SeedTypeService;
import MaziSheti.SeedType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seedtypes")
@CrossOrigin(origins = "http://localhost:5173") // Protect this with ROLE_ADMIN in SecurityConfig
public class SeedTypeController {

    @Autowired
    private SeedTypeService seedTypeService;

    @Autowired
    private ExcelSeedTypeService excelSeedTypeService;

    // ✅ Upload seed types via Excel
    @PostMapping("/upload")
    public ResponseEntity<String> uploadSeedTypes(@RequestParam("file") MultipartFile file) {
        try {
            excelSeedTypeService.uploadSeedTypes(file);
            return ResponseEntity.ok("Seed types uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    // ✅ Get all seed types
    @GetMapping
    public ResponseEntity<List<SeedType>> getAllSeedTypes() {
        return ResponseEntity.ok(seedTypeService.getAllSeedTypes());
    }

    // ✅ Get seed type by ID
    @GetMapping("/{id}")
    public ResponseEntity<SeedType> getSeedTypeById(@PathVariable Long id) {
        Optional<SeedType> seedType = seedTypeService.getSeedTypeById(id);
        return seedType.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Delete seed type by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeedType(@PathVariable Long id) {
        seedTypeService.deleteSeedType(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Get seed types by Crop ID
    @GetMapping("/byCrop/{cropId}")
    public ResponseEntity<List<SeedType>> getSeedTypesByCrop(@PathVariable Long cropId) {
        List<SeedType> seeds = seedTypeService.getSeedTypesByCropId(cropId);
        return ResponseEntity.ok(seeds);
    }
}
