package MaziSheti.Service;

import MaziSheti.FarmerReg;
import MaziSheti.Repository.FarmerRegRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FarmerRegServiceImpl implements FarmerRegService {

    @Autowired
    private FarmerRegRepository repository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Farmer submits registration form
    @Override
    public FarmerReg registerFarmer(FarmerReg farmer) {
        // Check if email already exists
        Optional<FarmerReg> existing = repository.findByEmail(farmer.getEmail());
        if (existing.isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Check password confirmation
        if (!farmer.getPassword().equals(farmer.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Encrypt the password
        String hashedPassword = passwordEncoder.encode(farmer.getPassword());
        farmer.setPassword(hashedPassword);
        farmer.setConfirmPassword(null); // Optionally clear confirm password
        farmer.setStatus("PENDING");

        return repository.save(farmer);
    }

    // Admin approves the farmer
    @Override
    public FarmerReg approveFarmer(Long id) {
        FarmerReg farmer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        if ("APPROVED".equalsIgnoreCase(farmer.getStatus())) {
            throw new RuntimeException("Farmer is already approved");
        }

        farmer.setStatus("APPROVED");
        FarmerReg saved = repository.save(farmer);

        // Send approval email
        emailService.sendApprovalEmail(farmer.getEmail(), farmer.getFullName());

        return saved;
    }

    // Optionally reject logic
    @Override
    public FarmerReg rejectFarmer(Long id) {
        FarmerReg farmer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        farmer.setStatus("REJECTED");
        return repository.save(farmer);
    }

    @Override
    public FarmerReg getFarmerByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    @Override
    public Iterable<FarmerReg> listAllFarmers() {
        return repository.findAll();
    }
}
