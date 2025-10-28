package MaziSheti;



import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "seed_types")
public class SeedType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;            
    private String type;            
    private String seedsPerAcre;   
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_id")
    @JsonIgnore 
    private Crop crop;

   
    public SeedType() {}

    public SeedType(String name, String type, String seedsPerAcre, Crop crop) {
        this.name = name;
        this.type = type;
        this.seedsPerAcre = seedsPerAcre;
        this.crop = crop;
    }

   

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getSeedsPerAcre() {
        return seedsPerAcre;
    }

    public Crop getCrop() {
        return crop;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setSeedsPerAcre(String seedsPerAcre) {
        this.seedsPerAcre = seedsPerAcre;
    }

    public void setCrop(Crop crop) {
        this.crop = crop;
    }

    

    @Override
    public String toString() {
        return "SeedType{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", seedsPerAcre='" + seedsPerAcre + '\'' +
                ", cropId=" + (crop != null ? crop.getId() : null) +
                '}';
    }
}
