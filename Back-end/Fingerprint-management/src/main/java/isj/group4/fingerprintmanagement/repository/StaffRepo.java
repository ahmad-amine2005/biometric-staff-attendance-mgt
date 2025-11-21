package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Department;
import isj.group4.fingerprintmanagement.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffRepo extends JpaRepository<Staff, Long> {
    @Override
    List<Staff> findAll();

    List<Staff> findStaffByDepartment_DpmtId(Long departmentDpmtId);

    Staff findStaffByUserId(Long userId);

    List<Staff> findStaffByContract_ContractDate(LocalDate contractContractDate);
}
