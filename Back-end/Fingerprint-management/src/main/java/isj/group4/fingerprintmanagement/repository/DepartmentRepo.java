package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepo extends JpaRepository<Department,Long> {
    @Override
    List<Department> findAll();

    Department findDepartmentByDpmtId(Long dpmtId);
}
