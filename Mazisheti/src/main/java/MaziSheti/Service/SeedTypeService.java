package MaziSheti.Service;

import MaziSheti.SeedType;
import MaziSheti.Repository.SeedTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeedTypeService {

    @Autowired
    private SeedTypeRepository seedTypeRepository;

    // Save a new seed type or update existing one
    public SeedType saveSeedType(SeedType seedType) {
        return seedTypeRepository.save(seedType);
    }

    // Retrieve all seed types
    public List<SeedType> getAllSeedTypes() {
        return seedTypeRepository.findAll();
    }

    // Retrieve a specific seed type by ID
    public Optional<SeedType> getSeedTypeById(Long id) {
        return seedTypeRepository.findById(id);
    }

    // Delete a seed type by ID
    public void deleteSeedType(Long id) {
        seedTypeRepository.deleteById(id);
    }

    // Retrieve seed types by crop ID
    public List<SeedType> getSeedTypesByCropId(Long cropId) {
        return seedTypeRepository.findByCropId(cropId);
    }
}
