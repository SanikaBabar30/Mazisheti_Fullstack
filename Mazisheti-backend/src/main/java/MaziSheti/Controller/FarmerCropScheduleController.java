package MaziSheti.Controller;

import MaziSheti.Dto.FarmerCropScheduleDTO;
import MaziSheti.Service.FarmerCropScheduleService;
import MaziSheti.Mapper.FarmerCropScheduleMapper;
import MaziSheti.FarmerCropSchedule;
import MaziSheti.Dto.ScheduleRequestDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FarmerCropScheduleController {

    @Autowired
    private FarmerCropScheduleService scheduleService;

    // 1. Get schedule by farmerId and exact date
    @GetMapping("/check/{farmerId}/{date}")
    public ResponseEntity<?> getScheduleByFarmerAndDate(
            @PathVariable Long farmerId,
            @PathVariable String date) {
        try {
            LocalDate scheduleDate = LocalDate.parse(date.trim());
            FarmerCropSchedule schedule = scheduleService.getScheduleByFarmerAndDate(farmerId, scheduleDate);
            if (schedule == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(FarmerCropScheduleMapper.toDTO(schedule));
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Please use YYYY-MM-DD.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error retrieving schedule.");
        }
    }

    // 2. Get schedule by farmerId and cropStageId
    @PostMapping("/checkByStage/{farmerId}/{cropStageId}")
    public ResponseEntity<?> getScheduleByFarmerAndCropStage(
            @PathVariable Long farmerId,
            @PathVariable Long cropStageId) {
        try {
            FarmerCropSchedule schedule = scheduleService.getScheduleByFarmerAndCropStage(farmerId, cropStageId);
            if (schedule == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(FarmerCropScheduleMapper.toDTO(schedule));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error retrieving schedule by crop stage.");
        }
    }

    // 3. Create new schedule manually via DTO
    @PostMapping("/create")
    public ResponseEntity<?> createSchedule(@RequestBody FarmerCropScheduleDTO dto) {
        try {
            FarmerCropSchedule createdSchedule = scheduleService.createSchedule(dto);
            return ResponseEntity.ok(FarmerCropScheduleMapper.toDTO(createdSchedule));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error creating schedule: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected error creating schedule.");
        }
    }

    // ✅ 4. Generate schedule (POST only)
 // ✅ 4. Generate schedule (POST only with JSON body)
    @PostMapping("/generate/{farmerId}/{cropId}")
    public ResponseEntity<?> generateSchedule(
            @PathVariable Long farmerId,
            @PathVariable Long cropId,
            @RequestBody ScheduleRequestDTO request) {

        try {
            LocalDate plantingDate = request.getPlantingDate();
            boolean overwrite = request.isOverwrite();

            List<FarmerCropSchedule> result = scheduleService.generateSchedule(farmerId, cropId, plantingDate, overwrite);

            if (result.isEmpty()) {
                return ResponseEntity.ok(List.of()); // Return empty list
            }
            return ResponseEntity.ok(FarmerCropScheduleMapper.toDTOList(result));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error generating schedule: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected server error occurred.");
        }
    }


    // 5. Get all schedules for a farmer
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<?> getAllSchedulesForFarmer(@PathVariable Long farmerId) {
        try {
            List<FarmerCropScheduleDTO> schedules = scheduleService.getAllSchedulesForFarmer(farmerId);
            return ResponseEntity.ok(schedules.isEmpty() ? List.of() : schedules);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch schedules for farmer.");
        }
    }
}
