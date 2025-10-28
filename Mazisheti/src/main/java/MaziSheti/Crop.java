package MaziSheti;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String soil;
    private String nutrients;
    private String climate;
    private String season;

    @Column(name = "snowing_season")
    private String snowingSeason;

    private String imageUrl;

    // Linking Crop with CropCategory
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private CropCategory category;


    @OneToMany(mappedBy = "crop", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<CropStage> cropStages = new ArrayList<>();

    
    public Crop() {}

    public Crop(String name, String soil, String nutrients, String climate, String season,
                String snowingSeason, String imageUrl, CropCategory category) {
        this.name = name;
        this.soil = soil;
        this.nutrients = nutrients;
        this.climate = climate;
        this.season = season;
        this.snowingSeason = snowingSeason;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSoil() { return soil; }
    public void setSoil(String soil) { this.soil = soil; }

    public String getNutrients() { return nutrients; }
    public void setNutrients(String nutrients) { this.nutrients = nutrients; }

    public String getClimate() { return climate; }
    public void setClimate(String climate) { this.climate = climate; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public String getSnowingSeason() { return snowingSeason; }
    public void setSnowingSeason(String snowingSeason) { this.snowingSeason = snowingSeason; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public CropCategory getCategory() { return category; }
    public void setCategory(CropCategory category) { this.category = category; }

    public List<CropStage> getCropStages() { return cropStages; }
    public void setCropStages(List<CropStage> cropStages) { this.cropStages = cropStages; }

    @Override
    public String toString() {
        return "Crop{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", soil='" + soil + '\'' +
                ", nutrients='" + nutrients + '\'' +
                ", climate='" + climate + '\'' +
                ", season='" + season + '\'' +
                ", snowingSeason='" + snowingSeason + '\'' +
                ", category='" + (category != null ? category.getName() : "null") + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
