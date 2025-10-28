package MaziSheti;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "product_catalog")
public class ProductCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🏷️ Basic product details
    private String productType;     // e.g., Fertilizer, Sensor
    private String productName;     // e.g., Soil Sensor Pro
    private String brandName;
    @Column(length = 2000)
    private String aboutProduct;

    // 🌿 Agricultural details
    private String activeIngredient;
    private String effectiveAgainst;
    private String targetCrops;
    private String dosage;
    private String benefits;

    // 📦 Packaging and pricing
    private String packingSize;
    private String batchNumber;
    private Double price;
    private Integer stockQuantity;

    // 📅 Important dates
    private LocalDate releaseDate;
    private LocalDate expiryDate;

    // 📸 Image path
    private String imageUrl;

    // ⚙️ Availability & approval status
    private Boolean available = true;     // For buyers (visible/in stock)
    private Boolean active = true;        // For admin/vendor control (enabled/disabled)

    // 👨‍🌾 Vendor relation (null means added by admin)
    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private VendorReg vendor;

    // ==========================
    // ✅ Constructors
    // ==========================
    public ProductCatalog() {}

    // ==========================
    // ✅ Getters & Setters
    // ==========================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public String getAboutProduct() { return aboutProduct; }
    public void setAboutProduct(String aboutProduct) { this.aboutProduct = aboutProduct; }

    public String getActiveIngredient() { return activeIngredient; }
    public void setActiveIngredient(String activeIngredient) { this.activeIngredient = activeIngredient; }

    public String getEffectiveAgainst() { return effectiveAgainst; }
    public void setEffectiveAgainst(String effectiveAgainst) { this.effectiveAgainst = effectiveAgainst; }

    public String getTargetCrops() { return targetCrops; }
    public void setTargetCrops(String targetCrops) { this.targetCrops = targetCrops; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }

    public String getPackingSize() { return packingSize; }
    public void setPackingSize(String packingSize) { this.packingSize = packingSize; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public VendorReg getVendor() { return vendor; }
    public void setVendor(VendorReg vendor) { this.vendor = vendor; }
}
