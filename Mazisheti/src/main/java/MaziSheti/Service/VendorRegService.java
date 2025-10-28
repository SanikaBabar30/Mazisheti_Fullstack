package MaziSheti.Service;

import MaziSheti.Dto.VendorRegDTO;
import MaziSheti.VendorReg;
import MaziSheti.Repository.VendorRegRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class VendorRegService {

    private final VendorRegRepository vendorRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public VendorRegService(VendorRegRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String registerVendor(VendorRegDTO dto) {

        // Field-level null/blank validation
        if (isBlank(dto.getOwnerName()) || isBlank(dto.getShopName()) || isBlank(dto.getEmail())
                || isBlank(dto.getMobileNumber()) || isBlank(dto.getPassword()) || isBlank(dto.getShopAddress())
                || isBlank(dto.getProductType()) || isBlank(dto.getLicenseNumber())) {
            return "All fields are required.";
        }

        // Email format validation
        if (!isValidEmail(dto.getEmail())) {
            return "Invalid email format.";
        }

        // Mobile format validation
        if (!isValidMobile(dto.getMobileNumber())) {
            return "Invalid mobile number. It must be 10 digits and not start with 0.";
        }

        // Uniqueness checks
        if (vendorRepository.existsByEmail(dto.getEmail())) {
            return "Email already registered.";
        }

        if (vendorRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
            return "License number already registered.";
        }

        // Password strength validation
        if (!isStrongPassword(dto.getPassword())) {
            return "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.";
        }

        // Save vendor
        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        VendorReg vendor = new VendorReg();
        vendor.setOwnerName(dto.getOwnerName());
        vendor.setShopName(dto.getShopName());
        vendor.setEmail(dto.getEmail());
        vendor.setMobileNumber(dto.getMobileNumber());
        vendor.setPassword(hashedPassword);
        vendor.setShopAddress(dto.getShopAddress());
        vendor.setProductType(dto.getProductType());
        vendor.setLicenseNumber(dto.getLicenseNumber());
        vendor.setProfileImagePath(dto.getProfileImagePath());

        vendorRepository.save(vendor);
        return "Vendor registered successfully.";
    }

    public List<VendorReg> getAllVendors() {
        return vendorRepository.findAll();
    }

    public VendorReg getVendorById(Long id) {
        Optional<VendorReg> vendorOpt = vendorRepository.findById(id);
        return vendorOpt.orElse(null);
    }

    // Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
    private boolean isStrongPassword(String password) {
        return password != null &&
               password.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$");
    }

    // Email validation
    private boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email != null && Pattern.matches(regex, email);
    }

    // Mobile validation: 10 digits, doesn't start with 0
    private boolean isValidMobile(String mobile) {
        return mobile != null && mobile.matches("^[1-9][0-9]{9}$");
    }

    // Blank/null check
    private boolean isBlank(String input) {
        return input == null || input.trim().isEmpty();
    }
}
