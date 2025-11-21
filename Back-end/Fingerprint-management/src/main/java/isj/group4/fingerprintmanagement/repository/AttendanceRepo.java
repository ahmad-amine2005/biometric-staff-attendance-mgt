package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AttendanceRepo extends JpaRepository<Attendance,Long> {
    List<Attendance> findAttendancesByStaffUserId(Long staffUserId);

    List<Attendance> findAttendancesByAttendanceDate(LocalDate attendanceDate);

    List<Attendance> findAttendancesByStaffUserIdAndAttendanceDate(Long staffUserId, LocalDate attendanceDate);

    List<Attendance> findAttendancesByAttendanceDateAndArrivalTime(LocalDate attendanceDate, LocalDateTime arrivalTime);

    List<Attendance> findAttendancesByAttendanceDateAndDepartureTime(LocalDate attendanceDate, LocalDateTime departureTime);

    List<Attendance> findAttendancesByStaff_Department_DpmtId(Long staffDepartmentDpmtId);

    Attendance findByAttendanceId(Long attendanceId);
}
