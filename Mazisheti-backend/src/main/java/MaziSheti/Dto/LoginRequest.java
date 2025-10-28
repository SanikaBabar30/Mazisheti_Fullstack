package MaziSheti.Dto;

/**
 * DTO for handling login requests across all user roles:
 * FARMER, VENDOR, BUYER, and ADMIN.
 */
public class LoginRequest {

    private String email;
    private String password;
    private String role; // Optional: used mainly for ADMIN login

    // 🧩 Default constructor (required for JSON deserialization)
    public LoginRequest() {}

    // 🧩 Parameterized constructor
    public LoginRequest(String email, String password, String role) {
        this.email = email != null ? email.trim() : null;
        this.password = password;
        this.role = role != null ? role.toUpperCase().trim() : null;
    }

    // --- Getters & Setters ---
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.trim() : null;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role != null ? role.toUpperCase().trim() : null;
    }

    // 🧩 Utility method for easy validation
    public boolean isValid() {
        return email != null && !email.isBlank() &&
               password != null && !password.isBlank();
    }
}
