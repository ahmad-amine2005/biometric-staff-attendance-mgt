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
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private staffService: StaffService,
    private attendanceService: AttendanceService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = '';

    // Load all data in parallel
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's attendance
    this.attendanceService.getAttendancesByDate(today).subscribe({
      next: (attendances) => {
        // Load staff to get total count
        this.staffService.getAllStaff().subscribe({
          next: (staff) => {
            const totalStaff = staff.length;
            const activeStaff = staff.filter(s => s.active !== false).length;
            const presentToday = attendances.filter(a => a.checkIn).length;
            const lateArrivals = attendances.filter(a => {
              if (!a.checkIn) return false;
              const [hours, minutes] = a.checkIn.split(':').map(Number);
              return hours > 9 || (hours === 9 && minutes > 0);
            }).length;
            const absent = activeStaff - presentToday;
            const attendanceRate = activeStaff > 0 ? (presentToday / activeStaff) * 100 : 0;
            const lateArrivalRate = presentToday > 0 ? (lateArrivals / presentToday) * 100 : 0;

            this.stats = {
              totalStaff,
              presentToday,
              absent: Math.max(0, absent),
              lateArrivals,
              onLeave: 0, // Can be enhanced later
              attendanceRate: Math.round(attendanceRate * 10) / 10,
              lateArrivalRate: Math.round(lateArrivalRate * 10) / 10
            };

            // Load recent check-ins
            this.loadRecentCheckIns(attendances);
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to load staff data';
            this.isLoading = false;
            console.error('Error loading staff:', error);
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to load attendance data';
        this.isLoading = false;
        console.error('Error loading attendance:', error);
      }
    });

    // Load departments
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (depts: DepartmentResponse[]) => {
        this.departments = depts;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  loadRecentCheckIns(attendances: any[]) {
    // Filter attendances with check-in times and sort by time (most recent first)
    const checkIns = attendances
      .filter(a => a.checkIn)
      .map(a => {
        const [hours, minutes] = a.checkIn.split(':').map(Number);
        const checkInTime = new Date();
        checkInTime.setHours(hours, minutes, 0, 0);
        return {
          attendance: a,
          time: checkInTime
        };
      })
      .sort((a, b) => b.time.getTime() - a.time.getTime()) // Most recent first
      .slice(0, 5) // Get top 5
      .map(item => {
        const [hours, minutes] = item.attendance.checkIn.split(':').map(Number);
        const isLate = hours > 9 || (hours === 9 && minutes > 0);
        return {
          name: item.attendance.staffName,
          time: item.attendance.checkIn,
          status: isLate ? 'Late' : 'On time'
        };
      });
    
    this.recentCheckIns = checkIns;
  }

  getAttendancePercentage(dept: DepartmentResponse): number {
    const totalStaff = dept.totalStaff || 0;
    const activeStaff = dept.activeStaff || 0;
    return totalStaff > 0 ? Math.round((activeStaff / totalStaff) * 100) : 0;
  }

  refreshData() {
    this.loadData();
  }

}
