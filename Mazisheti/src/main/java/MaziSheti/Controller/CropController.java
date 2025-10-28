package MaziSheti.Controller;

import MaziSheti.Dto.CropDTO;
import MaziSheti.Service.CropService;
import MaziSheti.Mapper.CropMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "http://localhost:5173")
public class CropController {

    @Autowired
    private CropService cropService;

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createCropWithImage(
            @ModelAttribute MaziSheti.Crop crop,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            MaziSheti.Crop savedCrop = cropService.saveCropWithImage(crop, imageFile);
            CropDTO dto = CropMapper.toDTO(savedCrop);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<CropDTO>> getAllCrops() {
        try {
            List<CropDTO> crops = cropService.getAllCropsDTO();
            return new ResponseEntity<>(crops, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CropDTO> getCropById(@PathVariable Long id) {
        try {
            CropDTO cropDto = cropService.getCropByIdDTO(id);
            return new ResponseEntity<>(cropDto, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteCrop(@PathVariable Long id) {
        try {
            cropService.deleteCrop(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/FethchCropsByCategoryId/{id}")
    public ResponseEntity<List<CropDTO>> fetchCropsByCategoryId(@PathVariable Long id) {
        try {
            List<CropDTO> crops = cropService.getCropsByCategoryDTO(id);
            return new ResponseEntity<>(crops, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
