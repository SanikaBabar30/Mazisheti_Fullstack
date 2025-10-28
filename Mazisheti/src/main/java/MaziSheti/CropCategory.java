package MaziSheti;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;

@Entity
@Table(name = "crop_categories")
public class CropCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;     
    private String imageUrl;  

    // Default constructor
    public CropCategory() {}

    // Constructor for name and image
    public CropCategory(String name, String imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }

   
    @JsonCreator
    public static CropCategory fromId(Long id) {
        CropCategory category = new CropCategory();
        category.setId(id);
        return category;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "CropCategory{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
