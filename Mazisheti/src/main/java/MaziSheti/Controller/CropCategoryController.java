package MaziSheti.Controller;

import MaziSheti.CropCategory;
import MaziSheti.Service.CropCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CropCategoryController {

    @Autowired
    private CropCategoryService cropCategoryService;

    @Value("${image.upload-dir}")
    private String uploadDir;

    @Value("${image.base-url}")
    private String imageBaseUrl;

    // Create crop category with image upload
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<CropCategory> createCropCategoryWithImage(
            @RequestPart("category") CropCategory category,
            @RequestPart("image") MultipartFile imageFile) {

        try {
            String imageUrl = saveImage(imageFile);     // Save image to disk
            category.setImageUrl(imageUrl);             // Set URL in DB
            CropCategory savedCategory = cropCategoryService.saveCropCategory(category);
            return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //  Get all categories
    @GetMapping
    public ResponseEntity<List<CropCategory>> getAllCropCategories() {
        return new ResponseEntity<>(cropCategoryService.getAllCropCategories(), HttpStatus.OK);
    }

    //  Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<CropCategory> getCropCategoryById(@PathVariable Long id) {
        Optional<CropCategory> category = cropCategoryService.getCropCategoryById(id);
        return category.map(c -> new ResponseEntity<>(c, HttpStatus.OK))
                       .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //  Delete category by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCropCategory(@PathVariable Long id) {
        cropCategoryService.deleteCropCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    //  Save image to disk and return public URL
    private String saveImage(MultipartFile imageFile) throws IOException {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
        File dest = new File(dir, fileName);
        imageFile.transferTo(dest);

        return imageBaseUrl + fileName; 
    }
}
