package MaziSheti.Controller;

import MaziSheti.Dto.FarmerCropScheduleDTO;
import MaziSheti.Service.FarmerCropScheduleService;
import MaziSheti.Mapper.FarmerCropScheduleMapper;
import MaziSheti.FarmerCropSchedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class FarmerCropScheduleController {

    @Autowired
    private FarmerCropScheduleService scheduleService;

    // ✅ 1. Get schedule by farmerId and date
    @GetMapping("/check/{farmerId}/{date}")
    public ResponseEntity<?> getScheduleByFarmerAndDate(
            @PathVariable Long farmerId,
            @PathVariable String date) {
        try {
            LocalDate scheduleDate = LocalDate.parse(date.trim());
            FarmerCropSchedule schedule = scheduleService.getScheduleByFarmerAndDate(farmerId, scheduleDate);
            if (schedule == null) {
                return ResponseEntity.notFound().build(); // Return 404 if no schedule found
            }
            return ResponseEntity.ok(FarmerCropScheduleMapper.toDTO(schedule));  // Map to DTO
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Use YYYY-MM-DD.");
        }
    }

    // ✅ 2. Get schedule by farmerId and cropStageId
    @GetMapping("/checkByStage/{farmerId}/{cropStageId}")
    public ResponseEntity<?> getScheduleByFarmerAndCropStage(
            @PathVariable Long farmerId,
            @PathVariable Long cropStageId) {
        FarmerCropSchedule schedule = scheduleService.getScheduleByFarmerAndCropStage(farmerId, cropStageId);
        if (schedule == null) {
            return ResponseEntity.notFound().build(); // Return 404 if no schedule found
        }
        return ResponseEntity.ok(FarmerCropScheduleMapper.toDTO(schedule));  // Map to DTO
    }

    // ✅ 3. Create new schedule manually
    @PostMapping("/create")
    public ResponseEntity<?> createSchedule(@RequestBody FarmerCropScheduleDTO dto) {
        try {
            FarmerCropSchedule createdSchedule = scheduleService.createSchedule(dto);
            return ResponseEntity.ok(FarmerCropScheduleMapper.toDTO(createdSchedule));  // Map to DTO
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());  // Return error message from service
        }
    }

    // ✅ 4. Generate or overwrite full schedule
    @GetMapping("/generate/{farmerId}/{cropId}")
    public ResponseEntity<?> generateSchedule(
            @PathVariable Long farmerId,
            @PathVariable Long cropId,
            @RequestParam("plantingDate") String plantingDateStr,
            @RequestParam(value = "overwrite", defaultValue = "false") boolean overwrite) {

        System.out.println("Received plantingDate: '" + plantingDateStr + "'");

        try {
            LocalDate plantingDate = LocalDate.parse(plantingDateStr.trim());
            List<FarmerCropSchedule> result = scheduleService.generateSchedule(farmerId, cropId, plantingDate, overwrite);

            if (result.isEmpty()) {
                return ResponseEntity.ok(List.of());  // 🔁 return empty list instead of 204
            }

            return ResponseEntity.ok(FarmerCropScheduleMapper.toDTOList(result));
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid plantingDate. Use format YYYY-MM-DD.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected error occurred.");
        }
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<?> getAllSchedulesForFarmer(@PathVariable Long farmerId) {
        try {
            List<FarmerCropScheduleDTO> schedules = scheduleService.getAllSchedulesForFarmer(farmerId);
            if (schedules.isEmpty()) {
                return ResponseEntity.ok(List.of());  // 🔁 return empty list
            }
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch schedules.");
        }
    }
}