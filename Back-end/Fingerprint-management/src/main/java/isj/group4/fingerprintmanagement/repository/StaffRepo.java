package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepo extends JpaRepository<Staff, Long> {
    
    /**
     * Find all staff members.
     */
    @Override
    List<Staff> findAll();

    /**
     * Find staff by user ID.
     */
    Optional<Staff> findByUserId(Long userId);

    /**
     * Find staff by email.
     */
    Optional<Staff> findByEmail(String email);

    /**
     * Find all staff in a specific department.
     */
    List<Staff> findByDepartment_DpmtId(Long departmentId);

    /**
     * Find staff by contract date.
     */
    List<Staff> findByContract_ContractDate(LocalDate contractDate);

    /**
     * Find active staff members only.
     */
    List<Staff> findByActiveTrue();

    /**
     * Find inactive staff members.
     */
    List<Staff> findByActiveFalse();

    /**
     * Find active staff in a specific department.
     */
    @Query("SELECT s FROM Staff s WHERE s.department.dpmtId = :deptId AND s.active = true")
    List<Staff> findActiveStaffByDepartment(@Param("deptId") Long departmentId);

    /**
     * Check if email exists.
     */
    boolean existsByEmail(String email);

    /**
     * Count staff by department.
     */
    long countByDepartment_DpmtId(Long departmentId);

    List<Staff> findStaffByContract_ContractDate(LocalDate contractContractDate);
}
