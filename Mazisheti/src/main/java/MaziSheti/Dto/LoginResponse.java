package MaziSheti.Dto;

public class LoginResponse {
    private Long id;
    private Long farmerId; 
    private String email;
    private String role;
    private boolean approved;
    private String token;

    public LoginResponse(Long id, Long farmerId, String email, String role, boolean approved, String token) {
        this.id = id;
        this.farmerId = farmerId;
        this.email = email;
        this.role = role;
        this.approved = approved;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public Long getFarmerId() { 
        return farmerId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public boolean isApproved() {
        return approved;
    }

    public String getToken() {
        return token;
    }
}
