package MaziSheti;



import jakarta.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN or FARMER

    private boolean approved = false; // Admins are always approved

    // Constructors
    public User() {}

    public User(String fullName, String email, String password, Role role, boolean approved) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.approved = approved;
    }

    // Getters and Setters

    public Long getId() { return id; }

    public String getFullName() { return fullName; }

    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }

    public void setRole(Role role) { this.role = role; }

    public boolean isApproved() { return approved; }

    public void setApproved(boolean approved) { this.approved = approved; }
}
