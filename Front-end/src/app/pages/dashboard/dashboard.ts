import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../services/staff';
import { AttendanceService } from '../../services/attendance';
import { Department } from '../../models/staff';
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
  departments: Department[] = [];
  recentCheckIns: RecentCheckIn[] = [];

  constructor(
    private staffService: StaffService,
    private attendanceService: AttendanceService
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
    this.staffService.getDepartments().subscribe(depts => {
      this.departments = depts;
    });
  }

  loadRecentCheckIns() {
    this.attendanceService.getRecentCheckIns().subscribe(recent => {
      this.recentCheckIns = recent;
    });
  }

  getAttendancePercentage(dept: Department): number {
    return dept.totalStaff > 0 ? (dept.presentToday / dept.totalStaff) * 100 : 0;
  }

}
