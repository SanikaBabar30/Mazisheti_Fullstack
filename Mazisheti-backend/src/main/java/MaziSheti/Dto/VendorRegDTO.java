package MaziSheti.Dto;

public class VendorRegDTO {

    private String ownerName;
    private String shopName;
    private String email;
    private String mobileNumber;
    private String password;
    private String shopAddress;
    private String productType;
    private String licenseNumber;
    private String profileImagePath; // optional
    private String status; // ✅ NEW FIELD

    // --- Extra Computed Fields for Frontend ---
    private String vendorName;   // alias for Shop/Owner
    private String vendorEmail;
    private String vendorMobile;
    private String vendorAddress;

    // --- Constructors ---
    public VendorRegDTO() {}

    public VendorRegDTO(String ownerName, String shopName, String email, String mobileNumber,
                        String password, String shopAddress, String productType,
                        String licenseNumber, String profileImagePath, String status) {
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

        // Map to new fields
        this.vendorName = (shopName != null && !shopName.isEmpty()) ? shopName : ownerName;
        this.vendorEmail = email;
        this.vendorMobile = mobileNumber;
        this.vendorAddress = shopAddress;
    }

    // --- Getters and Setters ---
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getShopAddress() { return shopAddress; }
    public void setShopAddress(String shopAddress) { this.shopAddress = shopAddress; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getProfileImagePath() { return profileImagePath; }
    public void setProfileImagePath(String profileImagePath) { this.profileImagePath = profileImagePath; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // --- New Vendor Info Fields ---
    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public String getVendorEmail() { return vendorEmail; }
    public void setVendorEmail(String vendorEmail) { this.vendorEmail = vendorEmail; }

    public String getVendorMobile() { return vendorMobile; }
    public void setVendorMobile(String vendorMobile) { this.vendorMobile = vendorMobile; }

    public String getVendorAddress() { return vendorAddress; }
    public void setVendorAddress(String vendorAddress) { this.vendorAddress = vendorAddress; }
}
