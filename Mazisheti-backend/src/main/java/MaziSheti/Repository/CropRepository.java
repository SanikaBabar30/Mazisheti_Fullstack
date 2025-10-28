package MaziSheti.Repository;

import MaziSheti.Crop;
import MaziSheti.CropStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CropRepository extends JpaRepository<Crop, Long> {

   
	Optional<Crop> findByNameIgnoreCase(String name);


    List<Crop> findByCategoryId(Long categoryId);
    

}
