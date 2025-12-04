import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { StaffService } from '../../services/staff';
import { AttendanceService } from '../../services/attendance';
import { Staff } from '../../models/staff';
import { Attendance } from '../../models/attendance';

interface StaffReport {
  name: string;
  department: string;
  daysPresent: number;
  totalDays: number;
  percentage: number;
  lateArrivals: number;
}

interface MonthlyStats {
  attendanceRate: number;
  lateArrivalRate: number;
  totalAbsences: number;
  totalDays: number;
  period: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit {

  monthlyStats: MonthlyStats | null = null;
  staffReports: StaffReport[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private staffService: StaffService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.isLoading = true;
    this.errorMessage = '';

    // Get date range for current month
    const { startDate, endDate, totalDays, period } = this.getCurrentMonthRange();

    // Get all staff and all attendance records for the month
    forkJoin({
      staff: this.staffService.getAllStaff(),
      attendances: this.getAttendancesForMonth(startDate, endDate)
    }).subscribe({
      next: ({ staff, attendances }) => {
        this.calculateReports(staff, attendances, totalDays, period);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load reports data';
        this.isLoading = false;
        console.error('Error loading reports:', error);
      }
    });
  }

  getCurrentMonthRange(): { startDate: string, endDate: string, totalDays: number, period: string } {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // First day of current month
    const startDate = new Date(year, month, 1);
    // Today
    const endDate = new Date(year, month, now.getDate());
    
    // Calculate total days (including today)
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Format dates as yyyy-MM-dd
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Format period string
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const period = `${monthNames[month]} ${year}`;
    
    return { startDate: startDateStr, endDate: endDateStr, totalDays, period };
  }

  getAttendancesForMonth(startDate: string, endDate: string) {
    // Get all attendance records and filter by date range
    return this.attendanceService.getAllAttendance().pipe(
      map(attendances => {
        return attendances.filter(att => {
          const attDate = att.date.toISOString().split('T')[0];
          return attDate >= startDate && attDate <= endDate;
        });
      })
    );
  }

  calculateReports(staff: Staff[], attendances: Attendance[], totalDays: number, period: string) {
    // Calculate monthly stats
    const activeStaff = staff.filter(s => s.active !== false);
    const totalStaff = activeStaff.length;
    
    // Count unique staff who have attendance records
    const staffWithAttendance = new Set(attendances.map(a => parseInt(a.staffId)));
    const presentCount = staffWithAttendance.size;
    
    // Calculate total expected attendance days (active staff * total days)
    const totalExpectedDays = totalStaff * totalDays;
    const totalPresentDays = attendances.filter(a => a.checkIn).length;
    const attendanceRate = totalExpectedDays > 0 ? (totalPresentDays / totalExpectedDays) * 100 : 0;
    
    // Count late arrivals
    const lateArrivals = attendances.filter(a => {
      if (!a.checkIn) return false;
      const [hours, minutes] = a.checkIn.split(':').map(Number);
      return hours > 9 || (hours === 9 && minutes > 0);
    }).length;
    const lateArrivalRate = totalPresentDays > 0 ? (lateArrivals / totalPresentDays) * 100 : 0;
    
    // Calculate total absences (expected - present)
    const totalAbsences = totalExpectedDays - totalPresentDays;
    
    this.monthlyStats = {
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      lateArrivalRate: Math.round(lateArrivalRate * 10) / 10,
      totalAbsences: Math.max(0, totalAbsences),
      totalDays,
      period
    };

    // Calculate individual staff reports
    this.staffReports = activeStaff.map(s => {
      // Get attendance records for this staff member
      const staffAttendances = attendances.filter(a => parseInt(a.staffId) === s.userId);
      const daysPresent = staffAttendances.filter(a => a.checkIn).length;
      const lateArrivals = staffAttendances.filter(a => {
        if (!a.checkIn) return false;
        const [hours, minutes] = a.checkIn.split(':').map(Number);
        return hours > 9 || (hours === 9 && minutes > 0);
      }).length;
      
      const percentage = totalDays > 0 ? Math.round((daysPresent / totalDays) * 100) : 0;
      
      return {
        name: s.name ? `${s.name} ${s.surname || ''}`.trim() : 'Unknown',
        department: s.departmentName || 'N/A',
        daysPresent,
        totalDays,
        percentage,
        lateArrivals
      };
    });

    // Sort by percentage (descending)
    this.staffReports.sort((a, b) => b.percentage - a.percentage);
  }

  exportReport() {
    if (this.staffReports.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare CSV data
    const headers = ['Name', 'Department', 'Days Present', 'Total Days', 'Attendance %', 'Late Arrivals'];
    const csvData = this.staffReports.map(report => [
      report.name,
      report.department,
      report.daysPresent.toString(),
      report.totalDays.toString(),
      `${report.percentage}%`,
      report.lateArrivals.toString()
    ]);

    // Add summary row
    if (this.monthlyStats) {
      csvData.push([]);
      csvData.push(['Summary', '', '', '', '', '']);
      csvData.push(['Period', this.monthlyStats.period, '', '', '', '']);
      csvData.push(['Total Days', this.monthlyStats.totalDays.toString(), '', '', '', '']);
      csvData.push(['Attendance Rate', `${this.monthlyStats.attendanceRate}%`, '', '', '', '']);
      csvData.push(['Late Arrival Rate', `${this.monthlyStats.lateArrivalRate}%`, '', '', '', '']);
      csvData.push(['Total Absences', this.monthlyStats.totalAbsences.toString(), '', '', '', '']);
    }

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const date = new Date();
    const filename = `attendance-report-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.csv`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  refreshReports() {
    this.loadReports();
  }

}
