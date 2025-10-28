package MaziSheti.Controller;

import MaziSheti.Service.CropStageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crop-stage")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CropStageController {

    @Autowired
    private CropStageService cropStageService;

    // Admin upload 
    @PostMapping("/upload")
    public ResponseEntity<String> uploadCropStageExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam("cropName") String cropName) {
    	
    	System.out.println("crop name : "+cropName );
        try {
            String message = cropStageService.uploadCropSchedule(file, cropName);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    // Farmer schedule generation 
    @GetMapping("/schedule")
    public ResponseEntity<List<Map<String, Object>>> getScheduleForFarmer(
            @RequestParam String cropName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        List<Map<String, Object>> schedule = cropStageService.generateScheduleForFarmer(cropName, startDate);
        return ResponseEntity.ok(schedule);
    }
}
