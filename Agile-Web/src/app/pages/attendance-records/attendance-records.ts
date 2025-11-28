import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../services/attendance';
import { Attendance } from '../../models/attendance';

@Component({
  selector: 'app-attendance-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-records.html',
  styleUrl: './attendance-records.scss',
})
export class AttendanceRecords implements OnInit {

  attendanceRecords: Attendance[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {
    this.isLoading = true;
    this.errorMessage = '';

    this.attendanceService.getAllAttendance().subscribe({
      next: (records) => {
        this.attendanceRecords = records;
        this.isLoading = false;
        console.log('Loaded attendance records:', records.length);
      },
      error: (error) => {
        // Handle 403 authentication errors specifically
        if (error.message.includes('403')) {
          this.errorMessage = 'Authentication required. Please log in to view attendance records.';
        } else if (error.message.includes('401')) {
          this.errorMessage = 'Your session has expired. Please log in again.';
        } else {
          this.errorMessage = `Failed to load attendance records: ${error.message}`;
        }
        this.isLoading = false;
        console.error('Error loading attendance:', error);
      }
    });
  }

  get filteredRecords(): Attendance[] {
    if (!this.searchQuery) return this.attendanceRecords;
    const query = this.searchQuery.toLowerCase();
    return this.attendanceRecords.filter(r =>
      r.staffName.toLowerCase().includes(query) ||
      r.department.toLowerCase().includes(query) ||
      r.date.toISOString().includes(query)
    );
  }

  exportRecords() {
    if (this.filteredRecords.length === 0) {
      alert('No records to export');
      return;
    }

    // Convert to CSV
    const headers = ['Date', 'Staff Name', 'Department', 'Check In', 'Check Out', 'Hours', 'Status'];
    const csvData = this.filteredRecords.map(record => [
      record.date.toISOString().split('T')[0],
      record.staffName,
      record.department,
      record.checkIn || '-',
      record.checkOut || '-',
      record.hoursWorked > 0 ? `${record.hoursWorked}h` : '-',
      record.status
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-records-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'present': 'bg-green-100 text-green-700',
      'absent': 'bg-red-100 text-red-700',
      'late': 'bg-yellow-100 text-yellow-700',
      'leave': 'bg-gray-100 text-gray-700',
      'half-day': 'bg-orange-100 text-orange-700'
    };
    return classes[status] || classes['present'];
  }

  refreshAttendance() {
    this.loadAttendance();
  }

}
