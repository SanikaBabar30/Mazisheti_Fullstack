package MaziSheti.Service;

import MaziSheti.Crop;
import MaziSheti.SeedType;
import MaziSheti.Repository.CropRepository;
import MaziSheti.Repository.SeedTypeRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.Optional;

@Service
public class ExcelSeedTypeService {

    @Autowired
    private SeedTypeRepository seedTypeRepository;

    @Autowired
    private CropRepository cropRepository;

    public void uploadSeedTypes(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            int rowNumber = 0;
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                rowNumber++;

                if (row.getRowNum() == 0) continue; // Skip header row

                try {
                    Cell nameCell = row.getCell(0);
                    Cell typeCell = row.getCell(1);
                    Cell seedsPerAcreCell = row.getCell(2);
                    Cell cropNameCell = row.getCell(3);

                    if (nameCell == null || seedsPerAcreCell == null || cropNameCell == null) {
                        System.out.println("Skipping row " + rowNumber + ": Missing required fields.");
                        continue;
                    }

                    String seedName = nameCell.getStringCellValue().trim();
                    String seedType = (typeCell != null) ? typeCell.getStringCellValue().trim() : "";

                    String seedsPerAcre = "";
                    if (seedsPerAcreCell.getCellType() == CellType.STRING) {
                        seedsPerAcre = seedsPerAcreCell.getStringCellValue().trim();
                    } else if (seedsPerAcreCell.getCellType() == CellType.NUMERIC) {
                        seedsPerAcre = String.valueOf(seedsPerAcreCell.getNumericCellValue());
                    } else {
                        System.out.println("Skipping row " + rowNumber + ": Invalid seedsPerAcre format.");
                        continue;
                    }

                    if (cropNameCell.getCellType() != CellType.STRING) {
                        System.out.println("Skipping row " + rowNumber + ": Invalid or missing crop name.");
                        continue;
                    }

                    String cropName = cropNameCell.getStringCellValue().trim();
                    Optional<Crop> optionalCrop = cropRepository.findByNameIgnoreCase(cropName);

                    if (optionalCrop.isEmpty()) {
                        System.out.println("Skipping row " + rowNumber + ": Crop '" + cropName + "' not found.");
                        continue;
                    }

                    Crop crop = optionalCrop.get();
                    SeedType newSeed = new SeedType(seedName, seedType, seedsPerAcre, crop);
                    seedTypeRepository.save(newSeed);

                } catch (Exception e) {
                    System.out.println("Skipping row " + rowNumber + ": Unexpected error - " + e.getMessage());
                    e.printStackTrace();
                }
            }
        }
    }
}
