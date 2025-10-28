package MaziSheti.Repository;

import MaziSheti.FarmerCropSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FarmerCropScheduleRepository extends JpaRepository<FarmerCropSchedule, Long> {

    FarmerCropSchedule findByFarmerIdAndCropStageId(Long farmerId, Long cropStageId);

    List<FarmerCropSchedule> findByFarmerId(Long farmerId);

    List<FarmerCropSchedule> findByFarmerIdAndCropStage_Crop_Id(Long farmerId, Long cropId);

    FarmerCropSchedule findByFarmerIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long farmerId, LocalDate date1, LocalDate date2
    );

    List<FarmerCropSchedule> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
            LocalDate date1, LocalDate date2
    );

    // Custom fetch query to resolve lazy loading issue
    @Query("SELECT f FROM FarmerCropSchedule f JOIN FETCH f.cropStage WHERE f.farmer.id = :farmerId")
    List<FarmerCropSchedule> findAllByFarmerIdWithCropStage(@Param("farmerId") Long farmerId);
}
