package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ContractRepo extends JpaRepository<Contract,Long> {
    Contract findByContractId(Long contractId);

    List<Contract> findContractsByNoDaysPerWeek(Integer noDaysPerWeek);
}
