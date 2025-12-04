import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../services/staff';
import { AttendanceService } from '../../services/attendance';
import { DepartmentService, DepartmentResponse } from '../../services/department.service';
import { AttendanceStats, RecentCheckIn } from '../../models/attendance';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{

  stats: AttendanceStats | null = null;
  departments: DepartmentResponse[] = [];
  recentCheckIns: RecentCheckIn[] = [];

  constructor(
    private staffService: StaffService,
    private attendanceService: AttendanceService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadDepartments();
    this.loadRecentCheckIns();
  }

  loadStats() {
    this.attendanceService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe((depts: DepartmentResponse[]) => {
      this.departments = depts;
    });
  }

  loadRecentCheckIns() {
    this.attendanceService.getRecentCheckIns().subscribe(recent => {
      this.recentCheckIns = recent;
    });
  }

  getAttendancePercentage(dept: DepartmentResponse): number {
    const totalStaff = dept.totalStaff || 0;
    const activeStaff = dept.activeStaff || 0;
    return totalStaff > 0 ? (activeStaff / totalStaff) * 100 : 0;
  }

}
