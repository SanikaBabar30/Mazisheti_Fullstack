package MaziSheti.Dto;

public class LoginResponse {
    private Long id;
    private Long farmerId;
    private Long vendorId;
    private Long buyerId;
    private String email;
    private String role;
    private boolean approved;
    private String token;

    // ✅ Full constructor (for flexibility)
    public LoginResponse(Long id, Long farmerId, Long vendorId, Long buyerId,
                         String email, String role, boolean approved, String token) {
        this.id = id;
        this.farmerId = farmerId;
        this.vendorId = vendorId;
        this.buyerId = buyerId;
        this.email = email;
        this.role = role;
        this.approved = approved;
        this.token = token;
    }

    // ✅ Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
