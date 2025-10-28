package MaziSheti.Repository;

import MaziSheti.CropStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CropStageRepository extends JpaRepository<CropStage, Long> {

    List<CropStage> findByCropName(String cropName);

    List<CropStage> findByCropIdOrderByStartDayAsc(Long cropId);

    
    @Query("SELECT cs FROM CropStage cs JOIN FETCH cs.crop")
    List<CropStage> findAllWithCrop();

}

