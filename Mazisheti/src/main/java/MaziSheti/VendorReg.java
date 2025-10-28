package MaziSheti;

import jakarta.persistence.*;

@Entity
@Table(name = "vendors")
public class VendorReg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private String shopName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 10)
    private String mobileNumber;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String shopAddress;

    @Column(nullable = false)
    private String productType;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    private String profileImagePath;

    @Column(nullable = false)
    private String status = "PENDING";  // NEW FIELD: status (PENDING, APPROVED, REJECTED)

    // --- Constructors ---
    public VendorReg() {
    }

    public VendorReg(Long id, String ownerName, String shopName, String email, String mobileNumber, String password,
                     String shopAddress, String productType, String licenseNumber, String profileImagePath, String status) {
        this.id = id;
        this.ownerName = ownerName;
        this.shopName = shopName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.password = password;
        this.shopAddress = shopAddress;
        this.productType = productType;
        this.licenseNumber = licenseNumber;
        this.profileImagePath = profileImagePath;
        this.status = status;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getShopAddress() {
        return shopAddress;
    }

    public void setShopAddress(String shopAddress) {
        this.shopAddress = shopAddress;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getProfileImagePath() {
        return profileImagePath;
    }

    public void setProfileImagePath(String profileImagePath) {
        this.profileImagePath = profileImagePath;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
