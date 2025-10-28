package MaziSheti.Dto;

import java.time.LocalDate;

public class ScheduleRequestDTO {
    private Long farmerId;
    private Long cropId;
    private LocalDate plantingDate; // ✅ rename to match frontend
    private boolean overwrite;      // ✅ rename to match frontend

    // Getters and Setters
    public Long getFarmerId() {
        return farmerId;
    }
    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public Long getCropId() {
        return cropId;
    }
    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public LocalDate getPlantingDate() {
        return plantingDate;
    }
    public void setPlantingDate(LocalDate plantingDate) {
        this.plantingDate = plantingDate;
    }

    public boolean isOverwrite() {
        return overwrite;
    }
    public void setOverwrite(boolean overwrite) {
        this.overwrite = overwrite;
    }
}
