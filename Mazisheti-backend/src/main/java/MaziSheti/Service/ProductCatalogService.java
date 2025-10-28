package MaziSheti.Service;

import MaziSheti.ProductCatalog;
import MaziSheti.VendorReg;
import MaziSheti.Repository.ProductCatalogRepository;
import MaziSheti.Repository.VendorRegRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Service for managing all product catalog operations including:
 * - Vendor product upload
 * - Admin product management
 * - Category fetching
 * - Image handling
 * - Automatic admin notifications
 */
@Service
public class ProductCatalogService {

    private final ProductCatalogRepository productCatalogRepository;
    private final VendorRegRepository vendorRegRepository;
    private final NotificationService notificationService; // 🔔 Injected for automatic notifications

    // Upload folder location
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    // Server port for generating public image URLs
    @Value("${server.port}")
    private String serverPort;

    public ProductCatalogService(ProductCatalogRepository productCatalogRepository,
                                 VendorRegRepository vendorRegRepository,
                                 NotificationService notificationService) {
        this.productCatalogRepository = productCatalogRepository;
        this.vendorRegRepository = vendorRegRepository;
        this.notificationService = notificationService;
    }

    // ===================== CATEGORY OPERATIONS =====================

    public List<String> getAllCategories() {
        return productCatalogRepository.findDistinctProductTypes();
    }

    public List<ProductCatalog> getByCategory(String category) {
        return productCatalogRepository.findByProductType(category);
    }

    // ===================== PRODUCT FETCH OPERATIONS =====================

    public List<ProductCatalog> getAllProducts() {
        return productCatalogRepository.findAll();
    }

    public ProductCatalog getProductById(Long productId) {
        return productCatalogRepository.findById(productId).orElse(null);
    }

    public List<ProductCatalog> getByVendor(Long vendorId) {
        return productCatalogRepository.findByVendor_Id(vendorId);
    }

    // ===================== CREATE / UPDATE OPERATIONS =====================

    /**
     * Saves a new product for a vendor and notifies admin.
     */
    public ProductCatalog saveProductForVendor(Long vendorId, ProductCatalog product, MultipartFile image) throws IOException {
        VendorReg vendor = vendorRegRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + vendorId));

        if (image != null && !image.isEmpty()) {
            product.setImageUrl(saveImage(image, product.getProductType()));
        }

        product.setVendor(vendor);
        ProductCatalog savedProduct = productCatalogRepository.save(product);

        // 🔔 Notify admin automatically
        notificationService.notifyAdmin("🛒 New product added by vendor (ID: " + vendorId + "): " + product.getProductName());

        return savedProduct;
    }

    /**
     * Saves a new product added by Admin (no notification needed).
     */
    public ProductCatalog saveProduct(ProductCatalog product, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            product.setImageUrl(saveImage(image, product.getProductType()));
        }

        product.setVendor(null);
        return productCatalogRepository.save(product);
    }

    /**
     * Updates an existing product and notifies admin if vendor updated.
     */
    public ProductCatalog updateProduct(Long productId, ProductCatalog updatedProduct, MultipartFile image) throws IOException {
        ProductCatalog existingProduct = productCatalogRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        copyProductFields(existingProduct, updatedProduct);

        if (image != null && !image.isEmpty()) {
            existingProduct.setImageUrl(saveImage(image, updatedProduct.getProductType()));
        }

        ProductCatalog updated = productCatalogRepository.save(existingProduct);

        // 🔔 Notify only if product belongs to a vendor
        if (existingProduct.getVendor() != null) {
            notificationService.notifyAdmin("✏️ Product updated by vendor (ID: " +
                    existingProduct.getVendor().getId() + "): " + updatedProduct.getProductName());
        }

        return updated;
    }

    // ===================== DELETE OPERATION =====================

    /**
     * Deletes a product and notifies admin if vendor-owned.
     */
    public void deleteProduct(Long productId) {
        ProductCatalog existingProduct = productCatalogRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        productCatalogRepository.deleteById(productId);

        // 🔔 Notify admin if vendor-owned
        if (existingProduct.getVendor() != null) {
            notificationService.notifyAdmin("🗑️ Product deleted by vendor (ID: " +
                    existingProduct.getVendor().getId() + "): " + existingProduct.getProductName());
        }
    }

    // ===================== IMAGE HANDLING =====================

    private String saveImage(MultipartFile image, String productType) throws IOException {
        String folderName = (productType == null || productType.isEmpty())
                ? "uncategorized"
                : productType.replaceAll("\\s+", "-").toLowerCase();

        Path uploadPath = Paths.get(UPLOAD_DIR + folderName + "/");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        image.transferTo(new File(filePath.toString()));

        return "http://localhost:" + serverPort + "/uploads/" + folderName + "/" + fileName;
    }

    // ===================== HELPER =====================

    private void copyProductFields(ProductCatalog target, ProductCatalog source) {
        target.setProductType(source.getProductType());
        target.setProductName(source.getProductName());
        target.setBrandName(source.getBrandName());
        target.setAboutProduct(source.getAboutProduct());
        target.setActiveIngredient(source.getActiveIngredient());
        target.setEffectiveAgainst(source.getEffectiveAgainst());
        target.setTargetCrops(source.getTargetCrops());
        target.setDosage(source.getDosage());
        target.setBenefits(source.getBenefits());
        target.setPackingSize(source.getPackingSize());
        target.setBatchNumber(source.getBatchNumber());
        target.setPrice(source.getPrice());
        target.setStockQuantity(source.getStockQuantity());
        target.setReleaseDate(source.getReleaseDate());
        target.setExpiryDate(source.getExpiryDate());
        target.setAvailable(source.getAvailable());
    }
}
