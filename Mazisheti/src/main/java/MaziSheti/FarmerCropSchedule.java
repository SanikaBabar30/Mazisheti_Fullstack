package MaziSheti;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "farmer_crop_schedule")
public class FarmerCropSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private FarmerReg farmer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crop_stage_id", nullable = false)
    private CropStage cropStage;

    private LocalDate startDate;
    private LocalDate endDate;

    // Add stage-related copied data
    private String stage;
    private String activities;
    private String pesticides;

   
    public FarmerCropSchedule() {
    }

    public FarmerCropSchedule(FarmerReg farmer, CropStage cropStage, LocalDate startDate, LocalDate endDate) {
        this.farmer = farmer;
        this.cropStage = cropStage;
        this.startDate = startDate;
        this.endDate = endDate;
    }

   
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FarmerReg getFarmer() {
        return farmer;
    }

    public void setFarmer(FarmerReg farmer) {
        this.farmer = farmer;
    }

    public CropStage getCropStage() {
        return cropStage;
    }

    public void setCropStage(CropStage cropStage) {
        this.cropStage = cropStage;
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

    @Override
    public String toString() {
        return "FarmerCropSchedule{" +
                "id=" + id +
                ", farmer=" + (farmer != null ? farmer.getFullName() : "null") +
                ", cropStage=" + (cropStage != null ? cropStage.getStage() : "null") +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", stage='" + stage + '\'' +
                ", activities='" + activities + '\'' +
                ", pesticides='" + pesticides + '\'' +
                '}';
    }
}
