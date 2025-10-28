package MaziSheti.Dto;

import java.time.LocalDate;

public class FarmerCropScheduleDTO {
    private Long farmerId;
    private Long cropStageId;
    private String stage;
    private String activities;
    private String pesticides;
    private LocalDate startDate;
    private LocalDate endDate;

   
    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public Long getCropStageId() {
        return cropStageId;
    }

    
    public void setCropStageId(Long cropStageId) {
        this.cropStageId = cropStageId;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getActivities() {
        return activities;
    }

    public void setActivities(String activities) {
        this.activities = activities;
    }

    public String getPesticides() {
        return pesticides;
    }

    public void setPesticides(String pesticides) {
        this.pesticides = pesticides;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
