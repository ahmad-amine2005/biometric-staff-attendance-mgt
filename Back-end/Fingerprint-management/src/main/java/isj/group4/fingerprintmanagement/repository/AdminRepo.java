package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Admin;
import isj.group4.fingerprintmanagement.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminRepo extends JpaRepository<Admin,Long> {

}
