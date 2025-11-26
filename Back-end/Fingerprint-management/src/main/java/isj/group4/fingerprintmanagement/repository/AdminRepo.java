package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepo extends JpaRepository<Admin, Long> {

    /**
     * Find admin by email address.
     * Used for authentication and login.
     */
    Optional<Admin> findByEmail(String email);


    /**
     * Check if admin exists by email.
     */
    boolean existsByEmail(String email);
}
