package isj.group4.fingerprintmanagement.services;

import isj.group4.fingerprintmanagement.entity.Contract;
import isj.group4.fingerprintmanagement.repository.ContractRepo;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Log4j2
public class ContractService {

    private ContractRepo contractRepo;

    public Contract saveContract(Contract contract){
        return contractRepo.save(contract);
    }

    public Contract getContractById(Long id){
        return contractRepo.findByContractId(id);
    }

    public Contract getStaffContract(Long staffId){
        return contractRepo.findContractByStaff_UserId(staffId);
    }

    public List<Contract> getContractsByNoDaysPerWeek(Integer noDaysPerWeek){
        return contractRepo.findContractsByNoDaysPerWeek(noDaysPerWeek);
    }

    public List<Contract> getContractsByDepartment(Long departmentId){
        return contractRepo.findContractsByStaff_Department_DpmtId(departmentId);
    }

    public List<Contract> getAllContracts(){
        return contractRepo.findAll(Sort.by(Sort.Direction.ASC, "contractDate"));
    }

}
