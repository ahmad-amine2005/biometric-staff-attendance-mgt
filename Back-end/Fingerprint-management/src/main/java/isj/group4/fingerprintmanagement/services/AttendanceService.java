package isj.group4.fingerprintmanagement.services;

import isj.group4.fingerprintmanagement.dto.AttendanceRequestDTO;
import isj.group4.fingerprintmanagement.dto.AttendanceResponseDTO;
import isj.group4.fingerprintmanagement.entity.Attendance;
import isj.group4.fingerprintmanagement.entity.Staff;
import isj.group4.fingerprintmanagement.repository.AttendanceRepo;
import isj.group4.fingerprintmanagement.repository.StaffRepo;
import lombok.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Log4j2
public class AttendanceService {

    private final AttendanceRepo attendanceRepo;
    private final StaffRepo staffRepo;

    /**
     * Record attendance based on the request.
     * If no attendance exists for the staff on the given date, create a new one with arrival time.
     * If attendance exists and arrival time is set but departure time is null, set departure time.
     *
     * @param requestDTO the attendance request containing staffId, attendanceDate, and attendanceTime
     * @return AttendanceResponseDTO with the recorded attendance details
     */
    public AttendanceResponseDTO recordAttendance(AttendanceRequestDTO requestDTO) {
        log.info("Recording attendance for staff ID: {} on date: {}",
                requestDTO.getStaffId(), requestDTO.getAttendanceDate());

        // Validate and retrieve staff
        Staff staff = staffRepo.findByUserId(requestDTO.getStaffId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Staff not found with ID: " + requestDTO.getStaffId()));

        // Check if attendance already exists for this staff on this date
        List<Attendance> existingAttendances = attendanceRepo
                .findAttendancesByStaffUserIdAndAttendanceDate(
                        requestDTO.getStaffId(),
                        requestDTO.getAttendanceDate());

        Attendance attendance;
        String status;

        if (existingAttendances.isEmpty()) {
            // No attendance record exists - create new one with arrival time
            attendance = Attendance.builder()
                    .staff(staff)
                    .attendanceDate(requestDTO.getAttendanceDate())
                    .arrivalTime(requestDTO.getAttendanceTime())
                    .departureTime(null)
                    .build();
            status = "ARRIVAL_RECORDED";
            log.info("Creating new attendance record with arrival time for staff ID: {}",
                    requestDTO.getStaffId());
        } else {
            // Attendance record exists - update departure time if arrival is already set
            attendance = existingAttendances.get(0);

            if (attendance.getArrivalTime() != null && attendance.getDepartureTime() == null) {
                // Arrival time is set, departure is null - set departure time
                attendance.setDepartureTime(requestDTO.getAttendanceTime());
                status = "DEPARTURE_RECORDED";
                log.info("Updating attendance record with departure time for staff ID: {}",
                        requestDTO.getStaffId());
            } else if (attendance.getDepartureTime() != null) {
                // Both times already set
                throw new IllegalStateException(
                        "Attendance already complete for staff ID: " + requestDTO.getStaffId()
                        + " on date: " + requestDTO.getAttendanceDate());
            } else {
                // Arrival time is null (shouldn't normally happen) - set arrival time
                attendance.setArrivalTime(requestDTO.getAttendanceTime());
                status = "ARRIVAL_RECORDED";
                log.warn("Setting arrival time for existing attendance record (unusual case) for staff ID: {}",
                        requestDTO.getStaffId());
            }
        }

        // Save the attendance record
        Attendance savedAttendance = attendanceRepo.save(attendance);

        // Convert to response DTO
        return convertToResponseDTO(savedAttendance, status);
    }

    public Attendance saveAttendance(Attendance attendance){
        return attendanceRepo.save(attendance);
    }

    public Attendance getAttendanceById(Long id){
        return attendanceRepo.findByAttendanceId(id);
    }

    public List<Attendance> getAttendancesByDate(String date){
        return attendanceRepo.findAttendancesByAttendanceDate(java.time.LocalDate.parse(date));
    }

    public List<Attendance> getStaffAttendances(Long staffId){
        return attendanceRepo.findAttendancesByStaffUserId(staffId);
    }

    public List<Attendance> getAllAttendances(){
        return attendanceRepo.findAll();
    }

    public List<Attendance> getAllAttendancesByDepartment(Long departmentId){
        return attendanceRepo.findAttendancesByStaff_Department_DpmtId(departmentId);
    }
    public List<Attendance> getAllAttendancesByDateAndArrivalTime(String date, String arrivalTime){
        return attendanceRepo.findAttendancesByAttendanceDateAndArrivalTime(
                java.time.LocalDate.parse(date),
                java.time.LocalDateTime.parse(arrivalTime)
        );
    }

    public List<Attendance> getAllAttendancesByDateAndDepartureTime(String date, String departureTime){
        return attendanceRepo.findAttendancesByAttendanceDateAndDepartureTime(
                java.time.LocalDate.parse(date),
                java.time.LocalDateTime.parse(departureTime)
        );
    }

    public List<Attendance> getAllAttendancesByStaffAndDate(Long staffId, String date){
        return attendanceRepo.findAttendancesByStaffUserIdAndAttendanceDate(
                staffId,
                java.time.LocalDate.parse(date)
        );
    }

    /**
     * Get attendance by ID and return as DTO
     */
    public AttendanceResponseDTO getAttendanceByIdAsDTO(Long id) {
        Attendance attendance = attendanceRepo.findByAttendanceId(id);
        if (attendance == null) {
            throw new IllegalArgumentException("Attendance not found with ID: " + id);
        }
        return convertToResponseDTO(attendance, determineStatus(attendance));
    }

    /**
     * Get all attendances by date and return as DTOs
     */
    public List<AttendanceResponseDTO> getAttendancesByDateAsDTO(String date) {
        List<Attendance> attendances = attendanceRepo.findAttendancesByAttendanceDate(
                java.time.LocalDate.parse(date));
        return attendances.stream()
                .map(att -> convertToResponseDTO(att, determineStatus(att)))
                .collect(Collectors.toList());
    }

    /**
     * Get all attendances for a staff and return as DTOs
     */
    public List<AttendanceResponseDTO> getStaffAttendancesAsDTO(Long staffId) {
        List<Attendance> attendances = attendanceRepo.findAttendancesByStaffUserId(staffId);
        return attendances.stream()
                .map(att -> convertToResponseDTO(att, determineStatus(att)))
                .collect(Collectors.toList());
    }

    /**
     * Get all attendances and return as DTOs
     */
    public List<AttendanceResponseDTO> getAllAttendancesAsDTO() {
        List<Attendance> attendances = attendanceRepo.findAll();
        return attendances.stream()
                .map(att -> convertToResponseDTO(att, determineStatus(att)))
                .collect(Collectors.toList());
    }

    /**
     * Get all attendances by department and return as DTOs
     */
    public List<AttendanceResponseDTO> getAllAttendancesByDepartmentAsDTO(Long departmentId) {
        List<Attendance> attendances = attendanceRepo
                .findAttendancesByStaff_Department_DpmtId(departmentId);
        return attendances.stream()
                .map(att -> convertToResponseDTO(att, determineStatus(att)))
                .collect(Collectors.toList());
    }

    /**
     * Convert Attendance entity to AttendanceResponseDTO
     */
    private AttendanceResponseDTO convertToResponseDTO(Attendance attendance, String status) {
        Staff staff = attendance.getStaff();

        return AttendanceResponseDTO.builder()
                .attendanceId(attendance.getAttendanceId())
                .attendanceDate(attendance.getAttendanceDate())
                .arrivalTime(attendance.getArrivalTime())
                .departureTime(attendance.getDepartureTime())
                .staffId(staff.getUserId())
                .staffName(staff.getName())
                .staffSurname(staff.getSurname())
                .staffEmail(staff.getEmail())
                .departmentId(staff.getDepartment() != null ? staff.getDepartment().getDpmtId() : null)
                .departmentName(staff.getDepartment() != null ? staff.getDepartment().getDpmtName() : null)
                .status(status)
                .build();
    }

    /**
     * Determine the status of an attendance record
     */
    private String determineStatus(Attendance attendance) {
        if (attendance.getArrivalTime() != null && attendance.getDepartureTime() != null) {
            return "COMPLETE";
        } else if (attendance.getArrivalTime() != null) {
            return "ARRIVAL_RECORDED";
        } else {
            return "INCOMPLETE";
        }
    }
}
