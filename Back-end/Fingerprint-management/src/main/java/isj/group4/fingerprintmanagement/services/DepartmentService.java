package isj.group4.fingerprintmanagement.services;

import isj.group4.fingerprintmanagement.dto.DepartmentDetailDTO;
import isj.group4.fingerprintmanagement.dto.DepartmentRequestDTO;
import isj.group4.fingerprintmanagement.dto.DepartmentResponseDTO;
import isj.group4.fingerprintmanagement.entity.Department;
import isj.group4.fingerprintmanagement.entity.Staff;
import isj.group4.fingerprintmanagement.repository.DepartmentRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Department management.
 * Handles all CRUD operations and business logic for departments.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class DepartmentService {

    private final DepartmentRepo departmentRepo;

    /**
     * Create a new department.
     *
     * @param requestDTO the department creation request
     * @return the created department as response DTO
     * @throws IllegalArgumentException if department name already exists
     */
    @Transactional
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO requestDTO) {
        log.info("Creating new department with name: {}", requestDTO.getDpmtName());

        // Validate department name doesn't exist
        if (departmentRepo.existsByDpmtName(requestDTO.getDpmtName())) {
            log.warn("Department creation failed: Name already exists: {}", requestDTO.getDpmtName());
            throw new IllegalArgumentException("Department name already exists: " + requestDTO.getDpmtName());
        }

        // Create department entity
        Department department = Department.builder()
                .dpmtName(requestDTO.getDpmtName())
                .build();

        Department savedDepartment = departmentRepo.save(department);
        log.info("Department created successfully: {} (ID: {})", savedDepartment.getDpmtName(), savedDepartment.getDpmtId());

        return mapToResponseDTO(savedDepartment);
    }

    /**
     * Get department by ID.
     *
     * @param departmentId the department ID
     * @return the department response DTO
     * @throws IllegalArgumentException if department not found
     */
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentById(Long departmentId) {
        log.debug("Fetching department with ID: {}", departmentId);

        Department department = departmentRepo.findByDpmtId(departmentId)
                .orElseThrow(() -> {
                    log.warn("Department not found with ID: {}", departmentId);
                    return new IllegalArgumentException("Department not found with ID: " + departmentId);
                });

        return mapToResponseDTO(department);
    }

    /**
     * Get detailed department information with staff list.
     *
     * @param departmentId the department ID
     * @return the detailed department DTO
     * @throws IllegalArgumentException if department not found
     */
    @Transactional(readOnly = true)
    public DepartmentDetailDTO getDepartmentDetails(Long departmentId) {
        log.debug("Fetching detailed information for department ID: {}", departmentId);

        Department department = departmentRepo.findByDpmtId(departmentId)
                .orElseThrow(() -> {
                    log.warn("Department not found with ID: {}", departmentId);
                    return new IllegalArgumentException("Department not found with ID: " + departmentId);
                });

        return mapToDetailDTO(department);
    }

    /**
     * Get department by name.
     *
     * @param name the department name
     * @return the department response DTO
     * @throws IllegalArgumentException if department not found
     */
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentByName(String name) {
        log.debug("Fetching department with name: {}", name);

        Department department = departmentRepo.findByDpmtName(name)
                .orElseThrow(() -> {
                    log.warn("Department not found with name: {}", name);
                    return new IllegalArgumentException("Department not found with name: " + name);
                });

        return mapToResponseDTO(department);
    }

    /**
     * Get all departments.
     *
     * @return list of all department response DTOs
     */
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getAllDepartments() {
        log.debug("Fetching all departments");
        return departmentRepo.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search departments by name (partial match, case-insensitive).
     *
     * @param namePart the partial name to search
     * @return list of matching departments
     */
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> searchDepartmentsByName(String namePart) {
        log.debug("Searching departments with name containing: {}", namePart);
        return departmentRepo.findByDpmtNameContainingIgnoreCase(namePart).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get departments with staff.
     *
     * @return list of departments that have staff members
     */
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getDepartmentsWithStaff() {
        log.debug("Fetching departments with staff");
        return departmentRepo.findDepartmentsWithStaff().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get empty departments (no staff).
     *
     * @return list of departments with no staff members
     */
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getEmptyDepartments() {
        log.debug("Fetching empty departments");
        return departmentRepo.findEmptyDepartments().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update department details.
     *
     * @param departmentId the department ID to update
     * @param requestDTO the update data
     * @return the updated department response DTO
     * @throws IllegalArgumentException if department not found or name already exists
     */
    @Transactional
    public DepartmentResponseDTO updateDepartment(Long departmentId, DepartmentRequestDTO requestDTO) {
        log.info("Updating department with ID: {}", departmentId);

        Department department = departmentRepo.findByDpmtId(departmentId)
                .orElseThrow(() -> {
                    log.warn("Update failed: Department not found with ID: {}", departmentId);
                    return new IllegalArgumentException("Department not found with ID: " + departmentId);
                });

        // Check if new name already exists for another department
        if (!department.getDpmtName().equals(requestDTO.getDpmtName())
                && departmentRepo.existsByDpmtName(requestDTO.getDpmtName())) {
            log.warn("Update failed: Department name already exists: {}", requestDTO.getDpmtName());
            throw new IllegalArgumentException("Department name already exists: " + requestDTO.getDpmtName());
        }

        department.setDpmtName(requestDTO.getDpmtName());
        Department updatedDepartment = departmentRepo.save(department);

        log.info("Department updated successfully: {} (ID: {})", updatedDepartment.getDpmtName(), departmentId);
        return mapToResponseDTO(updatedDepartment);
    }

    /**
     * Delete department.
     * Only allows deletion if department has no staff members.
     *
     * @param departmentId the department ID to delete
     * @throws IllegalArgumentException if department not found or has staff
     */
    @Transactional
    public void deleteDepartment(Long departmentId) {
        log.info("Deleting department with ID: {}", departmentId);

        Department department = departmentRepo.findByDpmtId(departmentId)
                .orElseThrow(() -> {
                    log.warn("Deletion failed: Department not found with ID: {}", departmentId);
                    return new IllegalArgumentException("Department not found with ID: " + departmentId);
                });

        // Check if department has staff
        if (department.getStaff() != null && !department.getStaff().isEmpty()) {
            log.warn("Deletion failed: Department has {} staff members", department.getStaff().size());
            throw new IllegalArgumentException(
                    "Cannot delete department with existing staff. Please reassign or remove staff first.");
        }

        departmentRepo.delete(department);
        log.info("Department deleted successfully: {} (ID: {})", department.getDpmtName(), departmentId);
    }

    /**
     * Force delete department (deletes with staff - use with caution).
     *
     * @param departmentId the department ID to delete
     * @throws IllegalArgumentException if department not found
     */
    @Transactional
    public void forceDeleteDepartment(Long departmentId) {
        log.warn("Force deleting department with ID: {}", departmentId);

        Department department = departmentRepo.findByDpmtId(departmentId)
                .orElseThrow(() -> {
                    log.warn("Force deletion failed: Department not found with ID: {}", departmentId);
                    return new IllegalArgumentException("Department not found with ID: " + departmentId);
                });

        int staffCount = department.getStaff() != null ? department.getStaff().size() : 0;
        departmentRepo.delete(department);

        log.warn("Department force deleted with {} staff members: {} (ID: {})",
                staffCount, department.getDpmtName(), departmentId);
    }

    /**
     * Check if department name exists.
     *
     * @param name the department name to check
     * @return true if name exists
     */
    @Transactional(readOnly = true)
    public boolean departmentNameExists(String name) {
        return departmentRepo.existsByDpmtName(name);
    }

    /**
     * Get department statistics.
     *
     * @param departmentId the department ID
     * @return statistics about the department
     */
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentStatistics(Long departmentId) {
        log.debug("Fetching statistics for department ID: {}", departmentId);

        Department department = departmentRepo.findByDpmtId(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + departmentId));

        return mapToResponseDTO(department);
    }

    /**
     * Map Department entity to DepartmentResponseDTO.
     *
     * @param department the department entity
     * @return the department response DTO
     */
    private DepartmentResponseDTO mapToResponseDTO(Department department) {
        int totalStaff = department.getStaff() != null ? department.getStaff().size() : 0;
        int activeStaff = department.getStaff() != null
                ? (int) department.getStaff().stream().filter(Staff::getActive).count()
                : 0;
        int totalReports = department.getReports() != null ? department.getReports().size() : 0;

        return DepartmentResponseDTO.builder()
                .dpmtId(department.getDpmtId())
                .dpmtName(department.getDpmtName())
                .totalStaff(totalStaff)
                .activeStaff(activeStaff)
                .totalReports(totalReports)
                .build();
    }

    /**
     * Map Department entity to DepartmentDetailDTO with staff list.
     *
     * @param department the department entity
     * @return the detailed department DTO
     */
    private DepartmentDetailDTO mapToDetailDTO(Department department) {
        int totalStaff = department.getStaff() != null ? department.getStaff().size() : 0;
        int activeStaff = department.getStaff() != null
                ? (int) department.getStaff().stream().filter(Staff::getActive).count()
                : 0;
        int totalReports = department.getReports() != null ? department.getReports().size() : 0;

        List<DepartmentDetailDTO.StaffSummaryDTO> staffList = department.getStaff() != null
                ? department.getStaff().stream()
                        .map(staff -> DepartmentDetailDTO.StaffSummaryDTO.builder()
                                .userId(staff.getUserId())
                                .fullName(staff.getName() + " " + staff.getSurname())
                                .email(staff.getEmail())
                                .active(staff.getActive())
                                .noAbsence(staff.getNoAbsence())
                                .build())
                        .collect(Collectors.toList())
                : List.of();

        return DepartmentDetailDTO.builder()
                .dpmtId(department.getDpmtId())
                .dpmtName(department.getDpmtName())
                .totalStaff(totalStaff)
                .activeStaff(activeStaff)
                .totalReports(totalReports)
                .staffList(staffList)
                .build();
    }
}
