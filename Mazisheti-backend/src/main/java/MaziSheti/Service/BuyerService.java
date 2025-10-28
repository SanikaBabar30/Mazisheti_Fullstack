package MaziSheti.Service;

import MaziSheti.Buyer;
import MaziSheti.Dto.BuyerDTO;
import MaziSheti.Repository.BuyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class BuyerService {

    private final BuyerRepository buyerRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public BuyerService(BuyerRepository buyerRepository) {
        this.buyerRepository = buyerRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // --- Register Buyer ---
    public String registerBuyer(BuyerDTO dto) {

        if (dto == null) return "Invalid request data.";

        String buyerName = dto.getBuyerName() != null ? dto.getBuyerName().trim() : null;
        String email = dto.getEmail() != null ? dto.getEmail().trim().toLowerCase() : null;
        String mobile = dto.getMobileNumber() != null ? dto.getMobileNumber().trim() : null;
        String password = dto.getPassword();

        if (isBlank(buyerName) || isBlank(email) || isBlank(mobile) || isBlank(password))
            return "All fields are required.";

        if (!isValidEmail(email)) return "Invalid email format.";
        if (!isValidMobile(mobile)) return "Invalid mobile number.";
        if (!isStrongPassword(password))
            return "Password must be at least 8 chars, include uppercase, lowercase, digit & special char.";

        if (buyerRepository.existsByEmail(email)) return "Email already registered.";
        if (buyerRepository.existsByMobileNumber(mobile)) return "Mobile number already registered.";

        Buyer buyer = new Buyer();
        buyer.setBuyerName(buyerName);
        buyer.setEmail(email);
        buyer.setMobileNumber(mobile);
        // ✅ Hash password using BCrypt
        buyer.setPassword(passwordEncoder.encode(password));

        buyerRepository.save(buyer);
        return "Buyer registered successfully!";
    }

    // --- Authenticate buyer and return Buyer object for frontend ---
    public Buyer authenticateBuyer(String email, String password) {
        Optional<Buyer> opt = buyerRepository.findByEmail(email);
        if (opt.isEmpty()) return null;

        Buyer buyer = opt.get();
        // ✅ Compare hashed password
        if (passwordEncoder.matches(password, buyer.getPassword())) {
            return buyer;
        }

        return null;
    }

    // --- Get all buyers ---
    public List<Buyer> getAllBuyers() {
        return buyerRepository.findAll();
    }

    // --- Get buyer by ID ---
    public Buyer getBuyerById(Long id) {
        return buyerRepository.findById(id).orElse(null);
    }

    // --- Validation helpers ---
    private boolean isBlank(String input) {
        return input == null || input.trim().isEmpty();
    }

    private boolean isValidEmail(String email) {
        return email != null && Pattern.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$", email);
    }

    private boolean isValidMobile(String mobile) {
        return mobile != null && mobile.matches("^[1-9][0-9]{9}$");
    }

    private boolean isStrongPassword(String password) {
        return password != null &&
               password.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$");
    }
}