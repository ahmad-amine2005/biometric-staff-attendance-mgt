package isj.group4.fingerprintmanagement.repository;

import isj.group4.fingerprintmanagement.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepo extends JpaRepository<Report,Long> {
    Report findByReportId(Long reportId);

    List<Report> findReportsByDepartment_DpmtId(Long departmentDpmtId);
}
