package MaziSheti.Service;

import MaziSheti.Crop;
import MaziSheti.Dto.CropDTO;
import MaziSheti.Mapper.CropMapper;
import MaziSheti.CropCategory;
import MaziSheti.Repository.CropRepository;
import jakarta.transaction.Transactional;
import MaziSheti.Repository.CropCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CropService {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private CropCategoryRepository cropCategoryRepository;

    private static final String IMAGE_UPLOAD_DIR = "uploads/images/";

    public Crop saveCropWithImage(Crop crop, MultipartFile imageFile) throws IOException {
        CropCategory category = cropCategoryRepository.findById(crop.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));
        crop.setCategory(category);
        String imageUrl = saveImage(imageFile);
        crop.setImageUrl(imageUrl);
        return cropRepository.save(crop);
    }

    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    public List<Crop> getAllcropsbyCategoryId(int id){
        return cropRepository.findByCategoryId((long) id);
    }

    @Transactional
    public Optional<Crop> getCropById(Long id) {
        return cropRepository.findById(id);
    }

    public List<Crop> getCropsByCategory(Long categoryId) {
        return cropRepository.findByCategoryId(categoryId);
    }

    public void deleteCrop(Long id) {
        cropRepository.deleteById(id);
    }

    private String saveImage(MultipartFile imageFile) throws IOException {
        File directory = new File(IMAGE_UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        String originalFileName = imageFile.getOriginalFilename();
        String uniqueFileName = System.currentTimeMillis() + "_" + originalFileName;
        Path filePath = Paths.get(IMAGE_UPLOAD_DIR + uniqueFileName);
        Files.write(filePath, imageFile.getBytes());
        return "http://localhost:8082/" + IMAGE_UPLOAD_DIR + uniqueFileName;
    }

    
    // Get all crops as DTOs
    public List<CropDTO> getAllCropsDTO() {
        List<Crop> crops = cropRepository.findAll();
        return crops.stream()
                .map(CropMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get crop by ID as DTO
    public CropDTO getCropByIdDTO(Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found with id " + id));
        return CropMapper.toDTO(crop);
    }

    // Get crops by category ID as DTOs
    public List<CropDTO> getCropsByCategoryDTO(Long categoryId) {
        List<Crop> crops = cropRepository.findByCategoryId(categoryId);
        return crops.stream()
                .map(CropMapper::toDTO)
                .collect(Collectors.toList());
    }
}
