import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../services/staff';
import { AttendanceService } from '../../services/attendance';
import { Staff } from '../../models/staff';
import { AttendanceStats } from '../../models/attendance';

interface StaffReport {
  name: string;
  department: string;
  daysPresent: number;
  totalDays: number;
  percentage: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit {

   stats: AttendanceStats | null = null;
  staffReports: StaffReport[] = [];

  constructor(
    private staffService: StaffService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadStaffReports();
  }

  loadStats() {
    this.attendanceService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  loadStaffReports() {
    this.staffService.getAllStaff().subscribe((staff: Staff[]) => {
      this.staffReports = staff.map(s => ({
        name: s.name ? `${s.name} ${s.surname || ''}`.trim() : 'Unknown',
        department: s.departmentName || 'N/A',
        daysPresent: s.totalAttendances || 0, // Use actual attendance data if available
        totalDays: 22,
        percentage: 0
      }));
      
      this.staffReports = this.staffReports.map(r => ({
        ...r,
        percentage: Math.round((r.daysPresent / r.totalDays) * 100)
      }));
    });
  }

  exportReport() {
    alert('Export report functionality would be implemented here');
  }

}
