package MaziSheti.Service;

import MaziSheti.Dto.LoginResponse;
import MaziSheti.FarmerReg;
import MaziSheti.VendorReg;
import MaziSheti.Buyer;
import MaziSheti.Repository.FarmerRegRepository;
import MaziSheti.Repository.VendorRegRepository;
import MaziSheti.Repository.BuyerRepository;
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
    private BuyerRepository buyerRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * 🔐 Unified authentication for Farmer, Vendor, and Buyer
     */
    public LoginResponse authenticate(String email, String password,
                                      FarmerRegRepository farmerRepo,
                                      VendorRegRepository vendorRepo,
                                      BuyerRepository buyerRepo,
                                      BCryptPasswordEncoder encoder) {

        // 1️⃣ Check Farmer
        Optional<FarmerReg> farmerOpt = farmerRepo.findByEmail(email);
        if (farmerOpt.isPresent()) {
            FarmerReg farmer = farmerOpt.get();
            if (!encoder.matches(password, farmer.getPassword())) {
                throw new RuntimeException("Invalid password");
            }
            boolean approved = "APPROVED".equalsIgnoreCase(farmer.getStatus());

            return new LoginResponse(
                    farmer.getId(),            // id
                    farmer.getId(),            // farmerId
                    null,                      // vendorId
                    null,                      // buyerId
                    farmer.getEmail(),
                    "FARMER",
                    approved,
                    jwtTokenUtil.generateToken(email, "FARMER")
            );
        }

        // 2️⃣ Check Vendor
        Optional<VendorReg> vendorOpt = vendorRepo.findByEmail(email);
        if (vendorOpt.isPresent()) {
            VendorReg vendor = vendorOpt.get();
            if (!encoder.matches(password, vendor.getPassword())) {
                throw new RuntimeException("Invalid password");
            }
            boolean approved = "APPROVED".equalsIgnoreCase(vendor.getStatus());

            return new LoginResponse(
                    vendor.getId(),            // id
                    null,                      // farmerId
                    vendor.getId(),            // vendorId
                    null,                      // buyerId
                    vendor.getEmail(),
                    "VENDOR",
                    approved,
                    jwtTokenUtil.generateToken(email, "VENDOR")
            );
        }

        // 3️⃣ Check Buyer
        Optional<Buyer> buyerOpt = buyerRepo.findByEmail(email);
        if (buyerOpt.isPresent()) {
            Buyer buyer = buyerOpt.get();
            if (!encoder.matches(password, buyer.getPassword())) {
                throw new RuntimeException("Invalid password");
            }

            return new LoginResponse(
                    buyer.getId(),             // id
                    null,                      // farmerId
                    null,                      // vendorId
                    buyer.getId(),             // buyerId ✅ important
                    buyer.getEmail(),
                    "BUYER",
                    true,                      // buyers are automatically approved
                    jwtTokenUtil.generateToken(email, "BUYER")
            );
        }

        // ❌ No user found
        throw new RuntimeException("User not found");
    }

    /**
     * 🔐 Admin authentication (separate)
     */
    public LoginResponse authenticateWithRole(String email, String password, String role) {
        if ("ADMIN".equalsIgnoreCase(role)) {
            if (!email.equalsIgnoreCase("mazisheti@gmail.com") || !password.equals("admin123")) {
                throw new RuntimeException("Invalid admin credentials");
            }

            return new LoginResponse(
                    0L,    // id
                    null,  // farmerId
                    null,  // vendorId
                    null,  // buyerId
                    email,
                    "ADMIN",
                    true,
                    jwtTokenUtil.generateToken(email, "ADMIN")
            );
        }
        throw new RuntimeException("Unsupported role: " + role);
    }
}
