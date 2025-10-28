package MaziSheti.Mapper;

import MaziSheti.Dto.FarmerCropScheduleDTO;
import MaziSheti.FarmerCropSchedule;
import MaziSheti.CropStage;
import MaziSheti.FarmerReg;
import MaziSheti.Repository.CropStageRepository;
import MaziSheti.Repository.FarmerRegRepository;

import java.util.List;
import java.util.stream.Collectors;

public class FarmerCropScheduleMapper {

    // Convert Entity to DTO
    public static FarmerCropScheduleDTO toDTO(FarmerCropSchedule schedule) {
        System.out.println("Mapping FarmerCropSchedule to DTO:");
        System.out.println("Stage: " + schedule.getStage());
        System.out.println("Activities: " + schedule.getActivities());
        System.out.println("Pesticides: " + schedule.getPesticides());

        FarmerCropScheduleDTO dto = new FarmerCropScheduleDTO();
        dto.setFarmerId(schedule.getFarmer().getId());
        dto.setCropStageId(schedule.getCropStage().getId());
        dto.setStage(schedule.getStage());
        dto.setActivities(schedule.getActivities());
        dto.setPesticides(schedule.getPesticides());
        dto.setStartDate(schedule.getStartDate());
        dto.setEndDate(schedule.getEndDate());

        return dto;
    }

    public static List<FarmerCropScheduleDTO> toDTOList(List<FarmerCropSchedule> schedules) {
        return schedules.stream()
                .map(FarmerCropScheduleMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Convert DTO to Entity
    public static FarmerCropSchedule toEntity(FarmerCropScheduleDTO dto,
                                              CropStageRepository cropStageRepository,
                                              FarmerRegRepository farmerRepository) {
        System.out.println("Mapping DTO to FarmerCropSchedule entity:");
        System.out.println("DTO CropStageId: " + dto.getCropStageId());
        System.out.println("DTO FarmerId: " + dto.getFarmerId());

        FarmerCropSchedule schedule = new FarmerCropSchedule();

        CropStage cropStage = cropStageRepository.findById(dto.getCropStageId())
                .orElseThrow(() -> new RuntimeException("CropStage not found"));
        System.out.println("Loaded CropStage: " + cropStage.getStage());

        FarmerReg farmer = farmerRepository.findById(dto.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        System.out.println("Loaded Farmer: " + farmer.getFullName());

        // Set entities
        schedule.setCropStage(cropStage);
        schedule.setFarmer(farmer);

        // ✅ Copy stage-related data
        schedule.setStage(cropStage.getStage());
        schedule.setActivities(cropStage.getActivities());
        schedule.setPesticides(cropStage.getPesticides());

        // Set schedule dates
        schedule.setStartDate(dto.getStartDate());
        schedule.setEndDate(dto.getEndDate());

        // Print what will be saved
        System.out.println("Saving Schedule:");
        System.out.println("Stage: " + schedule.getStage());
        System.out.println("Activities: " + schedule.getActivities());
        System.out.println("Pesticides: " + schedule.getPesticides());
        //System.out.println("StartDate: " + schedule.getStartDate());
        //System.out.println("EndDate: " + schedule.getEndDate());

        return schedule;
    }

    public static List<FarmerCropSchedule> toEntityList(List<FarmerCropScheduleDTO> dtos,
                                                        CropStageRepository cropStageRepository,
                                                        FarmerRegRepository farmerRepository) {
        return dtos.stream()
                .map(dto -> toEntity(dto, cropStageRepository, farmerRepository))
                .collect(Collectors.toList());
    }
}
