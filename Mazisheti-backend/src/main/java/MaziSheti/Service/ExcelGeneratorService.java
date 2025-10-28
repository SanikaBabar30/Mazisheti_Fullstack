package MaziSheti.Service;

import MaziSheti.Dto.TableReportDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class ExcelGeneratorService {

    public void generateExcel(List<TableReportDTO> reportData, String filePath) {
        try (Workbook workbook = new XSSFWorkbook()) {
            for (TableReportDTO dto : reportData) {
                Sheet sheet = workbook.createSheet(dto.getTableName());
                List<Map<String, Object>> rows = dto.getData();

                if (!rows.isEmpty()) {
                    Row headerRow = sheet.createRow(0);
                    List<String> headers = new ArrayList<>(rows.get(0).keySet());

                    for (int i = 0; i < headers.size(); i++) {
                        headerRow.createCell(i).setCellValue(headers.get(i));
                    }

                    for (int i = 0; i < rows.size(); i++) {
                        Row row = sheet.createRow(i + 1);
                        Map<String, Object> dataRow = rows.get(i);

                        for (int j = 0; j < headers.size(); j++) {
                            Object value = dataRow.get(headers.get(j));
                            row.createCell(j).setCellValue(value != null ? value.toString() : "");
                        }
                    }
                }
            }

            try (FileOutputStream out = new FileOutputStream(filePath)) {
                workbook.write(out);
                System.out.println("✅ Excel report generated: " + filePath);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
