package MaziSheti.Controller;

import MaziSheti.Dto.LoginRequest;
import MaziSheti.Dto.LoginResponse;
import MaziSheti.Dto.CompleteProfileRequest;
import MaziSheti.FarmerReg;
import MaziSheti.Repository.FarmerRegRepository;
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
    private BCryptPasswordEncoder passwordEncoder;

    // 🔐 Shared login for Farmer or Admin
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.authenticate(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin login
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
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody FarmerReg farmer) {
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

        // ✅ Encode the password before saving
        farmer.setPassword(passwordEncoder.encode(password));
        farmer.setStatus("PENDING");

        farmerRegRepository.save(farmer);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Farmer registered successfully and pending approval."));
    }

    // ✅ Complete profile after registration
    @PostMapping("/complete-profile")
    public ResponseEntity<?> completeProfile(@RequestBody CompleteProfileRequest request) {
        Optional<FarmerReg> farmerOpt = farmerRegRepository.findByEmail(request.getEmail());

        if (farmerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Farmer not found."));
        }

        FarmerReg farmer = farmerOpt.get();
        farmer.setAadhaar(request.getAadhaar());
        farmer.setCurrentAddress(request.getCurrentAddress());
        farmer.setFarmAddress(request.getFarmAddress());
        farmer.setDistrict(request.getDistrict());
        farmer.setLandSize(request.getLandSize());

        farmerRegRepository.save(farmer);

        return ResponseEntity.ok(Map.of("message", "Profile completed successfully."));
    }
}
