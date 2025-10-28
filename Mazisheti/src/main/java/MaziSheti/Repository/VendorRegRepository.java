package MaziSheti.Repository;


import MaziSheti.VendorReg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRegRepository extends JpaRepository<VendorReg, Long> {

    Optional<VendorReg> findByEmail(String email);

    Optional<VendorReg> findByLicenseNumber(String licenseNumber);

    boolean existsByEmail(String email);

    boolean existsByLicenseNumber(String licenseNumber);
}

