package MaziSheti.Service;

import MaziSheti.Crop;
import MaziSheti.CropStage;
import MaziSheti.Repository.CropRepository;
import MaziSheti.Repository.CropStageRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

@Service
public class CropStageService {

    @Autowired
    private CropStageRepository cropStageRepository;

    @Autowired
    private CropRepository cropRepository;

    public String uploadCropSchedule(MultipartFile file, String cropName) throws Exception {
        InputStream inputStream = file.getInputStream();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        Optional<Crop> cropOptional = cropRepository.findByNameIgnoreCase(cropName);
        if (!cropOptional.isPresent()) {
            throw new Exception("Crop not found with the name: " + cropName);
        }
        Crop crop = cropOptional.get();

        List<CropStage> stages = new ArrayList<>();

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;

            try {
                String stageName = getCellValue(row.getCell(0)).trim();
                String startDayStr = getCellValue(row.getCell(1)).trim();
                String endDayStr = getCellValue(row.getCell(2)).trim();
                String activities = getCellValue(row.getCell(3)).trim();
                String pesticides = getCellValue(row.getCell(4)).trim();

                // Validate and parse start and end days
                int startDay = Integer.parseInt(startDayStr);
                int endDay = Integer.parseInt(endDayStr);

                CropStage stage = new CropStage(
                        crop,
                        stageName,
                        startDay,
                        endDay,
                        activities,
                        pesticides
                );

                stages.add(stage);
            } catch (NumberFormatException e) {
                throw new Exception("Invalid number format in Excel at row " + (i + 1) +
                        ". Start Day and End Day must be numeric values.");
            } catch (Exception e) {
                throw new Exception("Error processing row " + (i + 1) + ": " + e.getMessage());
            }
        }

        cropStageRepository.saveAll(stages);
        return "Crop schedule uploaded successfully.";
    }

    public List<Map<String, Object>> generateScheduleForFarmer(String cropName, LocalDate startDate) {
        List<CropStage> stages = cropStageRepository.findByCropName(cropName);
        List<Map<String, Object>> schedule = new ArrayList<>();

        for (CropStage stage : stages) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("stage", stage.getStage());
            entry.put("startDate", startDate.plusDays(stage.getStartDay()));
            entry.put("endDate", startDate.plusDays(stage.getEndDay()));
            entry.put("activities", stage.getActivities());
            entry.put("pesticides", stage.getPesticides());
            schedule.add(entry);
        }

        return schedule;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";

        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue().trim();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            if (DateUtil.isCellDateFormatted(cell)) {
                return cell.getDateCellValue().toString();
            } else {
                double num = cell.getNumericCellValue();
                if (num == Math.floor(num)) {
                    return String.valueOf((int) num); // integer-like
                } else {
                    return String.valueOf(num); // decimal
                }
            }
        } else if (cell.getCellType() == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else if (cell.getCellType() == CellType.FORMULA) {
            return cell.getCellFormula();
        } else {
            return "";
        }
    }
}
