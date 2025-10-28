package MaziSheti.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "report.crop")
public class CropReportConfig {

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
