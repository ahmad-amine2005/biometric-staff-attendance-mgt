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

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {
    this.attendanceService.getAllAttendance().subscribe(records => {
      this.attendanceRecords = records;
    });
  }

  get filteredRecords(): Attendance[] {
    if (!this.searchQuery) return this.attendanceRecords;
    const query = this.searchQuery.toLowerCase();
    return this.attendanceRecords.filter(r => 
      r.staffName.toLowerCase().includes(query) ||
      r.department.toLowerCase().includes(query)
    );
  }

  exportRecords() {
    alert('Export functionality would be implemented here');
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

}
