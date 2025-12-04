package isj.group4.fingerprintmanagement.services;

import isj.group4.fingerprintmanagement.dto.StaffRequestDTO;
import isj.group4.fingerprintmanagement.dto.StaffResponseDTO;
import isj.group4.fingerprintmanagement.dto.StaffUpdateDTO;
import isj.group4.fingerprintmanagement.entity.Contract;
import isj.group4.fingerprintmanagement.entity.Department;
import isj.group4.fingerprintmanagement.entity.Staff;
import isj.group4.fingerprintmanagement.entity.User;
import isj.group4.fingerprintmanagement.repository.ContractRepo;
import isj.group4.fingerprintmanagement.repository.DepartmentRepo;
import isj.group4.fingerprintmanagement.repository.StaffRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service layer for Staff management.
 * Handles all CRUD operations and business logic for staff members.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class StaffService {

    private final StaffRepo staffRepo;
    private final DepartmentRepo departmentRepo;
    private final PasswordEncoder passwordEncoder;
    private final ContractRepo contractRepo;

    /**
     * Create a new staff member.
     *
     * @param staffRequest the staff creation request DTO
     * @return the created staff as response DTO
     * @throws IllegalArgumentException if email exists or department not found
     */
    @Transactional
    public StaffResponseDTO createStaff(StaffRequestDTO staffRequest) {
        log.info("Creating new staff with email: {}", staffRequest.getEmail());

        // Validate email doesn't exist
        if (staffRepo.existsByEmail(staffRequest.getEmail())) {
            log.warn("Staff creation failed: Email already exists: {}", staffRequest.getEmail());
            throw new IllegalArgumentException("Email already registered");
        }

        // Find department
        Department department = departmentRepo.findById(staffRequest.getDepartmentId())
                .orElseThrow(() -> {
                    log.warn("Staff creation failed: Department not found: {}", staffRequest.getDepartmentId());
                    return new IllegalArgumentException("Department not found with ID: " + staffRequest.getDepartmentId());
                });

        // Create staff entity
        Staff staff = new Staff();
        staff.setName(staffRequest.getName());
        staff.setSurname(staffRequest.getSurname());
        staff.setEmail(staffRequest.getEmail());
        staff.setRole(staffRequest.getRole() != null ? staffRequest.getRole() : User.Role.STAFF);
        staff.setActive(staffRequest.getActive() != null ? staffRequest.getActive() : true);
        staff.setNoAbsence(staffRequest.getNoAbsence() != null ? staffRequest.getNoAbsence() : 0);
        staff.setDepartment(department);

        Staff savedStaff = staffRepo.save(staff);

        log.info("Staff created successfully: {} (ID: {})", savedStaff.getEmail(), savedStaff.getUserId());

        Contract contract = new Contract();
        contract.setNoDaysPerWeek(staffRequest.getNoDaysPerWeek_contract());
        contract.setStartTime(staffRequest.getStartTime_contract());
        contract.setEndTime(staffRequest.getEndTime_contract());
        contract.setStaff(savedStaff);
        contract.setContractDate(LocalDate.now());
        Contract savedContract = contractRepo.save(contract);

        log.info("contract created successfully: {}, for staff: {}", savedContract.getContractDate(), savedContract.getStaff().getName());

        return mapToResponseDTO(savedStaff);
    }

    /**
     * Get staff by ID.
     *
     * @param staffId the staff user ID
     * @return the staff response DTO
     * @throws IllegalArgumentException if staff not found
     */
    @Transactional(readOnly = true)
    public StaffResponseDTO getStaffById(Long staffId) {
        log.debug("Fetching staff with ID: {}", staffId);

        Staff staff = staffRepo.findByUserId(staffId)
                .orElseThrow(() -> {
                    log.warn("Staff not found with ID: {}", staffId);
                    return new IllegalArgumentException("Staff not found with ID: " + staffId);
                });

        return mapToResponseDTO(staff);
    }

    /**
     * Get staff by email.
     *
     * @param email the staff email
     * @return Optional containing staff response DTO
     */
    @Transactional(readOnly = true)
    public Optional<StaffResponseDTO> getStaffByEmail(String email) {
        log.debug("Fetching staff with email: {}", email);
        return staffRepo.findByEmail(email).map(this::mapToResponseDTO);
    }

    /**
     * Get all staff members.
     *
     * @return list of all staff response DTOs
     */
    @Transactional(readOnly = true)
    public List<StaffResponseDTO> getAllStaff() {
        log.debug("Fetching all staff members");
        return staffRepo.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all active staff members.
     *
     * @return list of active staff response DTOs
     */
    @Transactional(readOnly = true)
    public List<StaffResponseDTO> getAllActiveStaff() {
        log.debug("Fetching all active staff members");
        return staffRepo.findByActiveTrue().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get staff by department.
     *
     * @param departmentId the department ID
     * @return list of staff in the department
     */
    @Transactional(readOnly = true)
    public List<StaffResponseDTO> getStaffByDepartment(Long departmentId) {
        log.debug("Fetching staff for department ID: {}", departmentId);
        return staffRepo.findByDepartment_DpmtId(departmentId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get active staff by department.
     *
     * @param departmentId the department ID
     * @return list of active staff in the department
     */
    @Transactional(readOnly = true)
    public List<StaffResponseDTO> getActiveStaffByDepartment(Long departmentId) {
        log.debug("Fetching active staff for department ID: {}", departmentId);
        return staffRepo.findActiveStaffByDepartment(departmentId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update staff details.
     *
     * @param staffId the staff ID to update
     * @param updateDTO the update data
     * @return the updated staff response DTO
     * @throws IllegalArgumentException if staff not found or email already exists
     */
    @Transactional
    public StaffResponseDTO updateStaff(Long staffId, StaffUpdateDTO updateDTO) {
        log.info("Updating staff with ID: {}", staffId);

        Staff staff = staffRepo.findByUserId(staffId)
                .orElseThrow(() -> {
                    log.warn("Update failed: Staff not found with ID: {}", staffId);
                    return new IllegalArgumentException("Staff not found with ID: " + staffId);
                });

        // Update fields if provided
        if (updateDTO.getName() != null && !updateDTO.getName().isEmpty()) {
            staff.setName(updateDTO.getName());
        }
        if (updateDTO.getSurname() != null && !updateDTO.getSurname().isEmpty()) {
            staff.setSurname(updateDTO.getSurname());
        }
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().isEmpty()) {
            // Check if email already exists for another staff
            if (!staff.getEmail().equals(updateDTO.getEmail()) && staffRepo.existsByEmail(updateDTO.getEmail())) {
                throw new IllegalArgumentException("Email already in use by another staff member");
            }
            staff.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getDepartmentId() != null) {
            Department department = departmentRepo.findById(updateDTO.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + updateDTO.getDepartmentId()));
            staff.setDepartment(department);
        }
        if (updateDTO.getNoAbsence() != null) {
            staff.setNoAbsence(updateDTO.getNoAbsence());
        }
        if (updateDTO.getActive() != null) {
            staff.setActive(updateDTO.getActive());
        }

        Staff updatedStaff = staffRepo.save(staff);
        log.info("Staff updated successfully: {} (ID: {})", updatedStaff.getEmail(), staffId);

        return mapToResponseDTO(updatedStaff);
    }



    /**
     * Increment absence count for staff.
     *
     * @param staffId the staff ID
     * @return the updated staff response DTO
     */
    @Transactional
    public StaffResponseDTO incrementAbsence(Long staffId) {
        log.info("Incrementing absence for staff ID: {}", staffId);

        Staff staff = staffRepo.findByUserId(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found with ID: " + staffId));

        staff.setNoAbsence(staff.getNoAbsence() + 1);
        Staff updated = staffRepo.save(staff);

        log.info("Absence incremented for staff ID: {}. New count: {}", staffId, updated.getNoAbsence());
        return mapToResponseDTO(updated);
    }

    /**
     * Reset absence count for staff.
     *
     * @param staffId the staff ID
     * @return the updated staff response DTO
     */
    @Transactional
    public StaffResponseDTO resetAbsence(Long staffId) {
        log.info("Resetting absence for staff ID: {}", staffId);

        Staff staff = staffRepo.findByUserId(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found with ID: " + staffId));

        staff.setNoAbsence(0);
        Staff updated = staffRepo.save(staff);

        log.info("Absence reset for staff ID: {}", staffId);
        return mapToResponseDTO(updated);
    }

    /**
     * Deactivate staff account (soft delete).
     *
     * @param staffId the staff ID
     * @throws IllegalArgumentException if staff not found
     */
    @Transactional
    public void deactivateStaff(Long staffId) {
        log.info("Deactivating staff with ID: {}", staffId);

        Staff staff = staffRepo.findByUserId(staffId)
                .orElseThrow(() -> {
                    log.warn("Deactivation failed: Staff not found with ID: {}", staffId);
                    return new IllegalArgumentException("Staff not found");
                });

        staff.setActive(false);
        staffRepo.save(staff);

        log.info("Staff deactivated successfully: {} (ID: {})", staff.getEmail(), staffId);
    }

    /**
     * Reactivate staff account.
     *
     * @param staffId the staff ID
     * @throws IllegalArgumentException if staff not found
     */
    @Transactional
    public void reactivateStaff(Long staffId) {
        log.info("Reactivating staff with ID: {}", staffId);

        Staff staff = staffRepo.findByUserId(staffId)
                .orElseThrow(() -> {
                    log.warn("Reactivation failed: Staff not found with ID: {}", staffId);
                    return new IllegalArgumentException("Staff not found");
                });

        staff.setActive(true);
        staffRepo.save(staff);

        log.info("Staff reactivated successfully: {} (ID: {})", staff.getEmail(), staffId);
    }

    /**
     * Delete staff permanently.
     *
     * @param staffId the staff ID
     * @throws IllegalArgumentException if staff not found
     */
    @Transactional
    public void deleteStaff(Long staffId) {
        log.info("Deleting staff with ID: {}", staffId);

        Staff staff = staffRepo.findByUserId(staffId)
                .orElseThrow(() -> {
                    log.warn("Deletion failed: Staff not found with ID: {}", staffId);
                    return new IllegalArgumentException("Staff not found");
                });

        staffRepo.delete(staff);
        log.info("Staff deleted successfully with ID: {}", staffId);
    }

    /**
     * Check if email exists.
     *
     * @param email the email to check
     * @return true if email exists
     */
    @Transactional(readOnly = true)
    public boolean emailExists(String email) {
        return staffRepo.existsByEmail(email);
    }

    /**
     * Count staff by department.
     *
     * @param departmentId the department ID
     * @return count of staff in department
     */
    @Transactional(readOnly = true)
    public long countStaffByDepartment(Long departmentId) {
        return staffRepo.countByDepartment_DpmtId(departmentId);
    }

    /**
     * Map Staff entity to StaffResponseDTO.
     *
     * @param staff the staff entity
     * @return the staff response DTO
     */
    private StaffResponseDTO mapToResponseDTO(Staff staff) {
        Contract contract = new Contract();
        contract = contractRepo.findContractByStaff_UserId(staff.getUserId());

        return StaffResponseDTO.builder()
                .userId(staff.getUserId())
                .name(staff.getName())
                .surname(staff.getSurname())
                .email(staff.getEmail())
                .role(staff.getRole())
                .active(staff.getActive())
                .noAbsence(staff.getNoAbsence())
                .departmentId(staff.getDepartment() != null ? staff.getDepartment().getDpmtId() : null)
                .departmentName(staff.getDepartment() != null ? staff.getDepartment().getDpmtName() : null)
                .contractId(contract != null ? contract.getContractId() : null)
                .contractStatus(contract != null ? "Active" : "No Contract")
                .totalAttendances(staff.getAttendances() != null ? staff.getAttendances().size() : 0)
                .build();
    }
}
