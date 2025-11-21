package isj.group4.fingerprintmanagement.services;

import isj.group4.fingerprintmanagement.entity.Staff;
import isj.group4.fingerprintmanagement.repository.StaffRepo;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Log4j2
public class StaffService {

    private final StaffRepo staffRepo;

    public Staff getStaffById(Long id){
        return staffRepo.findStaffByUserId(id);
    }

    public List<Staff> getStaffsByDepartment(Long departmentId){
        return staffRepo.findStaffByDepartment_DpmtId(departmentId);
    }

    public List<Staff> getAllStaffs(){
        return staffRepo.findAll();
    }

    public Staff createStaff(Staff staff){
        return staffRepo.save(staff);
    }
}
