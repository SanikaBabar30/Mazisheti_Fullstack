package MaziSheti.Service;

import MaziSheti.Dto.FarmerCropScheduleDTO;
import MaziSheti.FarmerCropSchedule;
import MaziSheti.FarmerReg;
import MaziSheti.CropStage;
import MaziSheti.Repository.FarmerCropScheduleRepository;
import MaziSheti.Repository.FarmerRegRepository;
import MaziSheti.Repository.CropStageRepository;
import MaziSheti.Mapper.FarmerCropScheduleMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FarmerCropScheduleService {

    @Autowired
    private FarmerCropScheduleRepository scheduleRepository;

    @Autowired
    private FarmerRegRepository farmerRepository;

    @Autowired
    private CropStageRepository cropStageRepository;

    @Autowired
    private EmailService emailService;

    public FarmerCropSchedule getScheduleByFarmerAndCropStage(Long farmerId, Long cropStageId) {
        System.out.println("🔍 Fetching schedule for Farmer ID: " + farmerId + ", CropStage ID: " + cropStageId);
        return scheduleRepository.findByFarmerIdAndCropStageId(farmerId, cropStageId);
    }

    public FarmerCropSchedule getScheduleByFarmerAndDate(Long farmerId, LocalDate date) {
        System.out.println("🔍 Fetching schedule for Farmer ID: " + farmerId + " on Date: " + date);
        return scheduleRepository.findByFarmerIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(farmerId, date, date);
    }

    public FarmerCropSchedule createSchedule(FarmerCropScheduleDTO dto) {
        logAuth();

        System.out.println("🛠 Creating schedule: Farmer ID = " + dto.getFarmerId() + ", CropStage ID = " + dto.getCropStageId());

        Optional<FarmerReg> farmerOpt = farmerRepository.findById(dto.getFarmerId());
        Optional<CropStage> stageOpt = cropStageRepository.findById(dto.getCropStageId());

        if (farmerOpt.isEmpty() || stageOpt.isEmpty()) {
            System.out.println("❌ Farmer or CropStage not found.");
            throw new RuntimeException("Farmer or CropStage not found");
        }

        FarmerReg farmer = farmerOpt.get();
        CropStage stage = stageOpt.get();

        FarmerCropSchedule existing = scheduleRepository.findByFarmerIdAndCropStageId(farmer.getId(), stage.getId());
        if (existing != null) {
            System.out.println("⚠️ Schedule already exists for this farmer and crop stage.");
            throw new RuntimeException("Schedule already exists for this farmer and crop stage.");
        }

        LocalDate startDate = dto.getStartDate();
        LocalDate endDate = dto.getEndDate();

        System.out.println("📅 Creating schedule from " + startDate + " to " + endDate);

        FarmerCropSchedule schedule = new FarmerCropSchedule(farmer, stage, startDate, endDate);
        schedule.setStage(stage.getStage());
        schedule.setActivities(stage.getActivities());
        schedule.setPesticides(stage.getPesticides());

        FarmerCropSchedule saved = scheduleRepository.save(schedule);

        System.out.println("✅ Schedule saved successfully");

        emailService.sendScheduleCreatedEmail(
            farmer.getEmail(),
            farmer.getFullName(),
            stage.getStage(),
            startDate,
            endDate,
            stage.getActivities(),
            stage.getPesticides()
        );

        return saved;
    }

    public List<FarmerCropSchedule> generateSchedule(Long farmerId, Long cropId, LocalDate plantingDate, boolean overwrite) {
        logAuth();

        System.out.println("🛠 Generating schedule for Farmer ID: " + farmerId + ", Crop ID: " + cropId + ", Planting Date: " + plantingDate + ", Overwrite: " + overwrite);

        Optional<FarmerReg> farmerOpt = farmerRepository.findById(farmerId);
        if (farmerOpt.isEmpty()) {
            System.out.println("❌ Farmer not found");
            throw new RuntimeException("Farmer not found");
        }

        FarmerReg farmer = farmerOpt.get();

        List<CropStage> stages = cropStageRepository.findByCropIdOrderByStartDayAsc(cropId);
        if (stages.isEmpty()) {
            System.out.println("❌ No crop stages found");
            throw new RuntimeException("No crop stages found for this crop.");
        }

        List<FarmerCropSchedule> existingSchedules = scheduleRepository.findByFarmerIdAndCropStage_Crop_Id(farmerId, cropId);
        if (!existingSchedules.isEmpty()) {
            System.out.println("⚠️ Existing schedules found: " + existingSchedules.size());
            if (!overwrite) {
                throw new RuntimeException("Schedule already exists for this crop. Enable overwrite to regenerate.");
            } else {
                scheduleRepository.deleteAll(existingSchedules);
                System.out.println("🗑 Deleted existing schedules");
            }
        }

        List<FarmerCropSchedule> newSchedules = new ArrayList<>();

        for (CropStage stage : stages) {
            LocalDate startDate = plantingDate.plusDays(stage.getStartDay());
            LocalDate endDate = plantingDate.plusDays(stage.getEndDay());

            System.out.println("📅 Creating stage: " + stage.getStage() + " | " + startDate + " to " + endDate);

            FarmerCropSchedule schedule = new FarmerCropSchedule(farmer, stage, startDate, endDate);
            schedule.setStage(stage.getStage());
            schedule.setActivities(stage.getActivities());
            schedule.setPesticides(stage.getPesticides());

            newSchedules.add(schedule);
        }

        // ✅ Save all schedules at once
        scheduleRepository.saveAll(newSchedules);

        // ✅ Send email after saving
        for (FarmerCropSchedule schedule : newSchedules) {
            emailService.sendScheduleCreatedEmail(
                farmer.getEmail(),
                farmer.getFullName(),
                schedule.getStage(),
                schedule.getStartDate(),
                schedule.getEndDate(),
                schedule.getActivities(),
                schedule.getPesticides()
            );
        }

        System.out.println("✅ Schedule generation complete. Total stages: " + newSchedules.size());
        return newSchedules;
    }

    @Transactional(readOnly = true)
    public List<FarmerCropScheduleDTO> getAllSchedulesForFarmer(Long farmerId) {
        System.out.println("📋 Getting all schedules for Farmer ID: " + farmerId);
        List<FarmerCropSchedule> schedules = scheduleRepository.findAllByFarmerIdWithCropStage(farmerId);
        return FarmerCropScheduleMapper.toDTOList(schedules);
    }

    private void logAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            System.out.println("👤 Authenticated user: " + auth.getName());
            System.out.println("🔐 Roles: " + auth.getAuthorities());
        } else {
            System.out.println("⚠️ No authenticated user found.");
        }
    }
}
