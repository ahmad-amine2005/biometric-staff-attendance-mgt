package isj.group4.fingerprintmanagement.services;

import isj.group4.fingerprintmanagement.entity.Attendance;
import isj.group4.fingerprintmanagement.repository.AttendanceRepo;
import lombok.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Log4j2
public class AttendanceService {

    private AttendanceRepo attendanceRepo;

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
}
