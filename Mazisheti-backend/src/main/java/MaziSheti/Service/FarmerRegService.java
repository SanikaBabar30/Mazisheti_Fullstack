package MaziSheti.Service;

import MaziSheti.FarmerReg;

public interface FarmerRegService {

    FarmerReg registerFarmer(FarmerReg farmer);

    FarmerReg approveFarmer(Long id);

    FarmerReg rejectFarmer(Long id);

    FarmerReg getFarmerByEmail(String email);

    Iterable<FarmerReg> listAllFarmers();
}
