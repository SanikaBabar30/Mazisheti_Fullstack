package MaziSheti.Repository;


import java.util.List;

import MaziSheti.SeedType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeedTypeRepository extends JpaRepository<SeedType, Long> {
	List<SeedType> findByCropId(Long cropId);

}
