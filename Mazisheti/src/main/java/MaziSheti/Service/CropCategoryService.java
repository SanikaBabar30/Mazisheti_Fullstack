package MaziSheti.Service;

import MaziSheti.CropCategory;
import MaziSheti.Repository.CropCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CropCategoryService {

    @Autowired
    private CropCategoryRepository cropCategoryRepository;

    // Create or update crop category
    public CropCategory saveCropCategory(CropCategory cropCategory) {
        return cropCategoryRepository.save(cropCategory);
    }

    // Get all crop categories
    public List<CropCategory> getAllCropCategories() {
        return cropCategoryRepository.findAll();
    }

    // Get crop category by ID
    public Optional<CropCategory> getCropCategoryById(Long id) {
        return cropCategoryRepository.findById(id);
    }

    // Delete crop category
    public void deleteCropCategory(Long id) {
        cropCategoryRepository.deleteById(id);
    }
}
