package MaziSheti.Controller;

import MaziSheti.FarmerReg;
import MaziSheti.Repository.FarmerRegRepository;
import MaziSheti.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FarmerRegController {

    @Autowired
    private FarmerRegRepository farmerRegRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // FARMER REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<String> registerFarmer(@RequestBody FarmerReg farmer) {
        farmer.setStatus("PENDING");
        farmer.setPassword(passwordEncoder.encode(farmer.getPassword())); // ✅ encode password
        farmerRegRepository.save(farmer);
        return ResponseEntity.ok("Registration successful. Awaiting approval.");
    }

    // ADMIN: GET ALL FARMERS
    @GetMapping("/admin/farmers")
    public ResponseEntity<List<FarmerReg>> getAllFarmers() {
        List<FarmerReg> allFarmers = farmerRegRepository.findAll();
        return ResponseEntity.ok(allFarmers);
    }

    // ADMIN: APPROVE FARMER
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<String> approveFarmer(@PathVariable Long id) {
        FarmerReg farmer = farmerRegRepository.findById(id).orElse(null);

        if (farmer == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"PENDING".equals(farmer.getStatus())) {
            return ResponseEntity.badRequest().body("Farmer is already approved.");
        }

        farmer.setStatus("APPROVED");
        farmerRegRepository.save(farmer);
        emailService.sendApprovalEmail(farmer.getEmail(), farmer.getFullName());
        return ResponseEntity.ok("Farmer approved and email sent.");
    }
}
