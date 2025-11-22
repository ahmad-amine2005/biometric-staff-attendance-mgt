package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepo extends JpaRepository<Department, Long> {

    /**
     * Find all departments.
     */
    @Override
    List<Department> findAll();

    /**
     * Find department by ID.
     */
    Optional<Department> findByDpmtId(Long dpmtId);

    /**
     * Find department by name.
     */
    Optional<Department> findByDpmtName(String dpmtName);

    /**
     * Find departments by name containing (case-insensitive search).
     */
    List<Department> findByDpmtNameContainingIgnoreCase(String namePart);

    /**
     * Check if department name exists.
     */
    boolean existsByDpmtName(String dpmtName);

    /**
     * Find departments with staff count.
     */
    @Query("SELECT d FROM Department d LEFT JOIN d.staff s GROUP BY d.dpmtId HAVING COUNT(s) > 0")
    List<Department> findDepartmentsWithStaff();

    /**
     * Find empty departments (no staff).
     */
    @Query("SELECT d FROM Department d WHERE d.staff IS EMPTY")
    List<Department> findEmptyDepartments();
}
