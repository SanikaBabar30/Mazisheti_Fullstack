package MaziSheti.Service;

import MaziSheti.Dto.LoginResponse;
import MaziSheti.FarmerReg;
import MaziSheti.Repository.FarmerRegRepository;
import MaziSheti.Repository.VendorRegRepository;
import MaziSheti.VendorReg;
import MaziSheti.Security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private FarmerRegRepository farmerRegRepository;

    @Autowired
    private VendorRegRepository vendorRegRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public LoginResponse authenticate(String email, String password) {

        // 1. Try to authenticate as a Farmer
        Optional<FarmerReg> farmerOpt = farmerRegRepository.findByEmail(email);
        if (farmerOpt.isPresent()) {
            FarmerReg farmer = farmerOpt.get();
            if (!passwordEncoder.matches(password, farmer.getPassword())) {
                throw new RuntimeException("Invalid password");
            }

            boolean approved = "APPROVED".equalsIgnoreCase(farmer.getStatus());

            return new LoginResponse(
                (long) farmer.getId(),
                (long) farmer.getId(),
                farmer.getEmail(),
                "FARMER",
                approved,
                jwtTokenUtil.generateToken(email, "FARMER")
            );
        }

        // 2. Try to authenticate as a Vendor
        Optional<VendorReg> vendorOpt = vendorRegRepository.findByEmail(email);
        if (vendorOpt.isPresent()) {
            VendorReg vendor = vendorOpt.get();
            if (!passwordEncoder.matches(password, vendor.getPassword())) {
                throw new RuntimeException("Invalid password");
            }

            boolean approved = "APPROVED".equalsIgnoreCase(vendor.getStatus());

            return new LoginResponse(
                (long) vendor.getId(),
                null,
                vendor.getEmail(),
                "VENDOR",
                approved,
                jwtTokenUtil.generateToken(email, "VENDOR")
            );
        }

        // 3. No user found
        throw new RuntimeException("User not found");
    }

    public LoginResponse authenticateWithRole(String email, String password, String role) {
        if ("ADMIN".equalsIgnoreCase(role)) {
            if (!email.equalsIgnoreCase("mazisheti@gmail.com") || !password.equals("admin123")) {
                throw new RuntimeException("Invalid admin credentials");
            }

            return new LoginResponse(
                0L,
                null,
                email,
                "ADMIN",
                true,
                jwtTokenUtil.generateToken(email, "ADMIN")
            );
        }

        throw new RuntimeException("Unsupported role: " + role);
    }
}
