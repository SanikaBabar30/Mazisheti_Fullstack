package MaziSheti.Repository;

import MaziSheti.FarmerReg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FarmerRegRepository extends JpaRepository<FarmerReg, Long> {

    List<FarmerReg> findByStatus(String status);

    Optional<FarmerReg> findByEmail(String email);

    
    List<FarmerReg> findAllByOrderByIdAsc();

    
    List<FarmerReg> findAllByOrderByFullNameAsc();

    
}
