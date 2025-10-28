package MaziSheti.Dto;

public class CompleteProfileRequest {
    private String email;
    private String aadhaar;
    private String currentAddress;
    private String farmAddress;
    private String district;
    private Double landSize;

    // Getters and Setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAadhaar() {
        return aadhaar;
    }

    public void setAadhaar(String aadhaar) {
        this.aadhaar = aadhaar;
    }

    public String getCurrentAddress() {
        return currentAddress;
    }

    public void setCurrentAddress(String currentAddress) {
        this.currentAddress = currentAddress;
    }

    public String getFarmAddress() {
        return farmAddress;
    }

    public void setFarmAddress(String farmAddress) {
        this.farmAddress = farmAddress;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public Double getLandSize() {
        return landSize;
    }

    public void setLandSize(Double landSize) {
        this.landSize = landSize;
    }
}
