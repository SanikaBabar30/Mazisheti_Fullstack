package MaziSheti.Controller;

import MaziSheti.*;
import MaziSheti.Config.*;
import MaziSheti.Repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.lang.reflect.Field;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReportController {

    @Autowired private ReportRepository reportRepository;
    @Autowired private FarmerRegRepository farmerRegRepository;
    @Autowired private CropRepository cropRepository;
    @Autowired private CropStageRepository cropStageRepository;
    @Autowired private SeedTypeRepository seedTypeRepository;
    @Autowired private FarmerCropScheduleRepository farmerCropScheduleRepository;

    @Autowired private FarmerReportConfig farmerReportConfig;
    @Autowired private CropReportConfig cropReportConfig;
    @Autowired private SeedTypeReportConfig seedTypeReportConfig;
    @Autowired private FarmerCropScheduleReportConfig farmerCropScheduleReportConfig;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getReports() {
        List<Report> reports = reportRepository.findAll();
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Report report : reports) {
            String reportType = report.getReportType().toLowerCase().trim();

            // Accept both "cropstage" and "cropstages" as valid
            if (reportType.equals("cropstages")) {
                reportType = "cropstage";
            }

            Map<String, Object> reportData = new HashMap<>();
            reportData.put("title", report.getTitle());
            reportData.put("reportType", report.getReportType());
            reportData.put("createdAt", report.getCreatedAt());

            switch (reportType) {
                case "farmer":
                    reportData.put("rows", handleGenericReport(FarmerReg.class, farmerRegRepository.findAll(), farmerReportConfig));
                    break;
                case "crop":
                    reportData.put("rows", handleGenericReport(Crop.class, cropRepository.findAll(), cropReportConfig, "cropStages"));
                    break;
                case "cropstage":
                    reportData.put("rows", handleCropStageReport());
                    break;
                case "seedtype":
                    reportData.put("rows", handleSeedTypeReport());
                    break;
                case "farmercropschedule":
                    reportData.put("rows", handleFarmerCropScheduleReport());
                    break;
                default:
                    reportData.put("rows", Collections.emptyList());
            }

            responseList.add(reportData);
        }

        return ResponseEntity.ok(responseList);
    }

    // Updated CropStage report handler — skips "crop" field completely
    private List<Map<String, Object>> handleCropStageReport() {
        List<CropStage> cropStages = cropStageRepository.findAll();
        List<String> requiredFields = List.of("id", "stage", "startDay", "endDay", "activities", "pesticides");
        Set<String> skipFields = Set.of("crop");  // Skip crop field

        List<Map<String, Object>> result = new ArrayList<>();

        for (CropStage cs : cropStages) {
            boolean isValid = true;
            try {
                for (String field : requiredFields) {
                    Field f = CropStage.class.getDeclaredField(field);
                    f.setAccessible(true);
                    Object value = f.get(cs);
                    if (value == null || (value instanceof String s && s.trim().isEmpty())) {
                        isValid = false;
                        break;
                    }
                }
            } catch (Exception e) {
                isValid = false;
            }

            if (isValid) {
                Map<String, Object> row = new LinkedHashMap<>();
                try {
                    for (Field field : CropStage.class.getDeclaredFields()) {
                        field.setAccessible(true);
                        String fieldName = field.getName();

                        if (skipFields.contains(fieldName)) {
                            continue;  // skip the crop field
                        }

                        Object value = field.get(cs);
                        row.put(fieldName, value);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                result.add(row);
            }
        }

        return result;
    }

    private List<Map<String, Object>> handleFarmerCropScheduleReport() {
        List<FarmerCropSchedule> schedules = farmerCropScheduleRepository.findAll();
        Set<String> requiredFields = new HashSet<>(farmerCropScheduleReportConfig.getRequiredFields());
        Set<String> skipFields = new HashSet<>(farmerCropScheduleReportConfig.getSkipFields());

        List<Map<String, Object>> result = new ArrayList<>();

        for (FarmerCropSchedule schedule : schedules) {
            boolean isValid = true;

            for (String field : requiredFields) {
                Object value = switch (field) {
                    case "farmer_id" -> schedule.getFarmer() != null ? schedule.getFarmer().getId() : null;
                    case "crop_stage_id" -> schedule.getCropStage() != null ? schedule.getCropStage().getId() : null;
                    case "start_date" -> schedule.getStartDate();
                    case "end_date" -> schedule.getEndDate();
                    case "activities" -> schedule.getActivities();
                    case "pesticides" -> schedule.getPesticides();
                    default -> null;
                };

                if (value == null || (value instanceof String s && s.trim().isEmpty())) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                Map<String, Object> row = new LinkedHashMap<>();
                if (!skipFields.contains("farmer_id"))
                    row.put("farmer_id", schedule.getFarmer() != null ? schedule.getFarmer().getId() : null);
                if (!skipFields.contains("crop_stage_id"))
                    row.put("crop_stage_id", schedule.getCropStage() != null ? schedule.getCropStage().getId() : null);
                if (!skipFields.contains("start_date")) row.put("start_date", schedule.getStartDate());
                if (!skipFields.contains("end_date")) row.put("end_date", schedule.getEndDate());
                if (!skipFields.contains("activities")) row.put("activities", schedule.getActivities());
                if (!skipFields.contains("pesticides")) row.put("pesticides", schedule.getPesticides());
                result.add(row);
            }
        }

        return result;
    }

    private List<Map<String, Object>> handleSeedTypeReport() {
        List<SeedType> seedTypes = seedTypeRepository.findAll();
        Set<String> required = new HashSet<>(seedTypeReportConfig.getRequiredFields());
        Set<String> skip = new HashSet<>(seedTypeReportConfig.getSkipFields());

        List<Map<String, Object>> result = new ArrayList<>();

        for (SeedType seed : seedTypes) {
            boolean isValid = true;

            for (String field : required) {
                try {
                    if ("crop_id".equals(field)) {
                        if (seed.getCrop() == null || seed.getCrop().getId() == null) {
                            isValid = false;
                            break;
                        }
                    } else {
                        Field f = SeedType.class.getDeclaredField(field);
                        f.setAccessible(true);
                        Object value = f.get(seed);
                        if (value == null || (value instanceof String s && s.trim().isEmpty())) {
                            isValid = false;
                            break;
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    isValid = false;
                }
            }

            if (isValid) {
                Map<String, Object> row = new LinkedHashMap<>();
                for (Field field : SeedType.class.getDeclaredFields()) {
                    field.setAccessible(true);
                    try {
                        if ("crop".equals(field.getName())) {
                            row.put("crop_id", seed.getCrop() != null ? seed.getCrop().getId() : null);
                        } else if (!skip.contains(field.getName())) {
                            row.put(field.getName(), field.get(seed));
                        }
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
                result.add(row);
            }
        }

        return result;
    }

    private <T> List<Map<String, Object>> handleGenericReport(Class<T> clazz, List<T> list, Object config, String... skipExtras) {
        Set<String> required = new HashSet<>();
        Set<String> skip = new HashSet<>(Arrays.asList(skipExtras));

        if (config instanceof FarmerReportConfig c) {
            required.addAll(c.getRequiredFields());
            skip.addAll(c.getSkipFields());
        } else if (config instanceof CropReportConfig c) {
            required.addAll(c.getRequiredFields());
            skip.addAll(c.getSkipFields());
        } else if (config instanceof SeedTypeReportConfig c) {
            required.addAll(c.getRequiredFields());
            skip.addAll(c.getSkipFields());
        } else if (config instanceof FarmerCropScheduleReportConfig c) {
            required.addAll(c.getRequiredFields());
            skip.addAll(c.getSkipFields());
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (T item : list) {
            boolean isValid = true;

            for (String fieldName : required) {
                try {
                    Field field = clazz.getDeclaredField(fieldName);
                    field.setAccessible(true);
                    Object value = field.get(item);
                    if (value == null || (value instanceof String s && s.trim().isEmpty())) {
                        isValid = false;
                        break;
                    }
                } catch (Exception e) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                Map<String, Object> row = new LinkedHashMap<>();
                for (Field field : clazz.getDeclaredFields()) {
                    field.setAccessible(true);
                    if (!skip.contains(field.getName())) {
                        try {
                            Object value = field.get(item);
                            if (value != null && isEntity(value)) {
                                Map<String, Object> relatedMap = new LinkedHashMap<>();
                                for (Field relField : value.getClass().getDeclaredFields()) {
                                    relField.setAccessible(true);
                                    Object relVal = relField.get(value);
                                    if (!(relVal instanceof Collection)) {
                                        relatedMap.put(relField.getName(), relVal);
                                    }
                                }
                                row.put(field.getName(), relatedMap);
                            } else {
                                row.put(field.getName(), value);
                            }
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                        }
                    }
                }
                result.add(row);
            }
        }

        return result;
    }

    private boolean isEntity(Object obj) {
        return obj.getClass().getPackageName().startsWith("MaziSheti");
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadReport() {
        File file = new File("report.xlsx");
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.xlsx")
                .body(resource);
    }
}
