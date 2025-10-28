package MaziSheti.Controller;

import MaziSheti.Buyer;
import MaziSheti.Dto.BuyerDTO;
import MaziSheti.Service.BuyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/buyers")
@CrossOrigin(origins = "http://localhost:5173")
public class BuyerController {

    private final BuyerService buyerService;

    @Autowired
    public BuyerController(BuyerService buyerService) {
        this.buyerService = buyerService;
    }

    // --- Register Buyer ---
    @PostMapping("/register")
    public ResponseEntity<String> registerBuyer(@RequestBody BuyerDTO dto) {
        String response = buyerService.registerBuyer(dto);
        if (response.equals("Buyer registered successfully!"))
            return ResponseEntity.ok(response);
        else
            return ResponseEntity.badRequest().body(response);
    }

    // --- Buyer Login ---
    @PostMapping("/login")
    public ResponseEntity<?> loginBuyer(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Buyer buyer = buyerService.authenticateBuyer(email, password);
        if (buyer != null) {
            // Return minimal info for frontend
            return ResponseEntity.ok(new LoginResponse(buyer.getId(), buyer.getEmail(), "BUYER"));
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    // --- DTO for Login Response ---
    static class LoginResponse {
        private Long buyerId;
        private String email;
        private String role;

        public LoginResponse(Long buyerId, String email, String role) {
            this.buyerId = buyerId;
            this.email = email;
            this.role = role;
        }

        public Long getBuyerId() { return buyerId; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}