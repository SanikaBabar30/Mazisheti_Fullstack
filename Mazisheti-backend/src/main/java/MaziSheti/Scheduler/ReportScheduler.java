package MaziSheti.Scheduler;

import MaziSheti.Dto.TableReportDTO;
import MaziSheti.Service.ExcelGeneratorService;
import MaziSheti.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReportScheduler {

    @Autowired
    private ReportService reportService;

    @Autowired
    private ExcelGeneratorService excelGeneratorService;

    @Scheduled(fixedRate = 300000) // every 5 minutes
    public void updateReport() {
        List<TableReportDTO> reportData = reportService.fetchNonEmptyTableData();
        excelGeneratorService.generateExcel(reportData, "report.xlsx");
    }
}
