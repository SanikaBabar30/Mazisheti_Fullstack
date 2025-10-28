package MaziSheti.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "report.farmer")
public class FarmerReportConfig {
    private List<String> requiredFields;
    private List<String> skipFields;

    public List<String> getRequiredFields() {
        return requiredFields;
    }

    public void setRequiredFields(List<String> requiredFields) {
        this.requiredFields = requiredFields;
    }

    public List<String> getSkipFields() {
        return skipFields;
    }

    public void setSkipFields(List<String> skipFields) {
        this.skipFields = skipFields;
    }
}
