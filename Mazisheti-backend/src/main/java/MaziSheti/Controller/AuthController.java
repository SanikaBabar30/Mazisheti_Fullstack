package MaziSheti.Controller;

import MaziSheti.Dto.LoginRequest;
import MaziSheti.Dto.LoginResponse;
import MaziSheti.FarmerReg;
import MaziSheti.VendorReg;
import MaziSheti.Buyer;
import MaziSheti.Repository.FarmerRegRepository;
import MaziSheti.Repository.VendorRegRepository;
import MaziSheti.Repository.BuyerRepository;
import MaziSheti.Service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private FarmerRegRepository farmerRegRepository;

    @Autowired
    private VendorRegRepository vendorRegRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 🔐 Unified login for Farmer, Vendor, Buyer
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        if (email == null || password == null || email.isBlank() || password.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email and password are required."));
        }

        try {
            LoginResponse response = authService.authenticate(email, password, farmerRegRepository, vendorRegRepository, buyerRepository, passwordEncoder);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin login remains separate
    @PostMapping("/login/admin")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.authenticateWithRole(
                request.getEmail(), request.getPassword(), "ADMIN"
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Farmer registration with password encryption
    @PostMapping("/register/farmer")
    public ResponseEntity<?> registerFarmer(@RequestBody FarmerReg farmer) {
        String email = farmer.getEmail();
        String password = farmer.getPassword();

        if (email == null || password == null || email.isBlank() || password.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email and Password are required."));
        }

        Optional<FarmerReg> existing = farmerRegRepository.findByEmail(email);
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already exists."));
        }

        // Encode password before saving
        farmer.setPassword(passwordEncoder.encode(password));
        farmer.setStatus("PENDING");

        farmerRegRepository.save(farmer);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Farmer registered successfully and pending approval."));
    }
}