package MaziSheti.Service;

import MaziSheti.ProductType;
import MaziSheti.Repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class ProductTypeService {

    private final ProductTypeRepository productTypeRepository;

    // Inject your server URL from application.properties
    @Value("${app.base-url:http://localhost:8082}")
    private String baseUrl;

    private final String UPLOAD_DIR = "uploads/product-types/";

    public ProductTypeService(ProductTypeRepository productTypeRepository) {
        this.productTypeRepository = productTypeRepository;
    }

    // Add new product type
    public ProductType addProductType(ProductType productType) {
        if (productTypeRepository.findByName(productType.getName()).isPresent()) {
            throw new RuntimeException("Product type already exists");
        }
        return productTypeRepository.save(productType);
    }

    // Get all product types
    public List<ProductType> getAllProductTypes() {
        return productTypeRepository.findAll();
    }

    // Update product type without image
    public ProductType updateProductType(Long id, ProductType productType) {
        ProductType existing = productTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product type not found"));

        existing.setName(productType.getName());
        return productTypeRepository.save(existing);
    }

    // Update product type with image
    public ProductType updateProductTypeWithImage(Long id, String name, MultipartFile imageFile) throws IOException {
        ProductType existing = productTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product type not found"));

        existing.setName(name);

        if (imageFile != null && !imageFile.isEmpty()) {
            Path uploadPath = Paths.get(UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filename = imageFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // ✅ Store FULL URL
            String imageUrl = baseUrl + "/uploads/product-types/" + filename;
            existing.setImageUrl(imageUrl);
        }

        return productTypeRepository.save(existing);
    }

    // Delete product type
    public void deleteProductType(Long id) {
        if (!productTypeRepository.existsById(id)) {
            throw new RuntimeException("Product type not found");
        }
        productTypeRepository.deleteById(id);
    }
}
