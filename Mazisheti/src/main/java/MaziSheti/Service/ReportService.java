package MaziSheti.Service;

import MaziSheti.Dto.TableReportDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final List<String> excludedTables = Arrays.asList("crop_info", "reports", "user");

    public List<TableReportDTO> fetchNonEmptyTableData() {
        List<TableReportDTO> reports = new ArrayList<>();
        List<String> allTables = jdbcTemplate.queryForList("SHOW TABLES", String.class);

        List<String> includedTables = allTables.stream()
                .filter(t -> !excludedTables.contains(t))
                .collect(Collectors.toList());

        for (String table : includedTables) {
            try {
                List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT * FROM " + table);

                if (!rows.isEmpty()) {
                    TableReportDTO dto = new TableReportDTO();
                    dto.setTableName(table);
                    dto.setData(rows);
                    reports.add(dto);
                }
            } catch (Exception e) {
                System.out.println("Error reading table " + table + ": " + e.getMessage());
            }
        }

        return reports;
    }
}
