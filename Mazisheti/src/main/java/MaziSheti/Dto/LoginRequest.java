package MaziSheti.Dto;


public class LoginRequest {
    private String email;
    private String password;

    //  Getter for email
    public String getEmail() {
        return email;
    }

    //  Getter for password
    public String getPassword() {
        return password;
    }

    
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
