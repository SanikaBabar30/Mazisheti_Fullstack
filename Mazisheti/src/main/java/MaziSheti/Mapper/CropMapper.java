package MaziSheti.Mapper;

import MaziSheti.Crop;
import MaziSheti.Dto.CropDTO;

public class CropMapper {

    public static CropDTO toDTO(Crop crop) {
        CropDTO dto = new CropDTO();
        dto.setId(crop.getId());
        dto.setName(crop.getName());
        dto.setSoil(crop.getSoil());
        dto.setNutrients(crop.getNutrients());
        dto.setClimate(crop.getClimate());
        dto.setSeason(crop.getSeason());
        dto.setSnowingSeason(crop.getSnowingSeason());
        dto.setImageUrl(crop.getImageUrl());

        if (crop.getCategory() != null) {
            dto.setCategoryId(crop.getCategory().getId());
            dto.setCategoryName(crop.getCategory().getName());
        }

        return dto;
    }
}
