import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Attendance, AttendanceStats, RecentCheckIn } from '../models/attendance';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
   private attendanceSubject = new BehaviorSubject<Attendance[]>([]);
  public attendance$ = this.attendanceSubject.asObservable();

  private mockAttendance: Attendance[] = [
    { id: '1', staffId: '1', staffName: 'Sarah Johnson', department: 'Engineering', date: new Date('2025-11-20'), checkIn: '09:00', checkOut: '17:22', hoursWorked: 8.0, status: 'present' },
    { id: '2', staffId: '2', staffName: 'Michael Chen', department: 'Engineering', date: new Date('2025-11-20'), checkIn: undefined, checkOut: undefined, hoursWorked: 0, status: 'leave' },
    { id: '3', staffId: '3', staffName: 'Emily Rodriguez', department: 'Human Resources', date: new Date('2025-11-20'), checkIn: '08:00', checkOut: '16:05', hoursWorked: 8.0, status: 'present' },
    { id: '4', staffId: '4', staffName: 'James Wilson', department: 'Sales', date: new Date('2025-11-20'), checkIn: '08:00', checkOut: '16:02', hoursWorked: 8.0, status: 'present' },
    { id: '5', staffId: '5', staffName: 'Lisa Anderson', department: 'Marketing', date: new Date('2025-11-20'), checkIn: '09:00', checkOut: '17:11', hoursWorked: 8.0, status: 'present' },
    { id: '6', staffId: '6', staffName: 'David Martinez', department: 'Engineering', date: new Date('2025-11-20'), checkIn: '09:00', checkOut: '17:06', hoursWorked: 8.0, status: 'present' },
    { id: '7', staffId: '7', staffName: 'Jessica Taylor', department: 'Operations', date: new Date('2025-11-20'), checkIn: '08:00', checkOut: '16:23', hoursWorked: 8.0, status: 'present' },
    { id: '8', staffId: '8', staffName: 'Robert Brown', department: 'Sales', date: new Date('2025-11-20'), checkIn: '08:30', checkOut: '16:14', hoursWorked: 8.0, status: 'present' }
  ];

  constructor() {
    this.attendanceSubject.next(this.mockAttendance);
  }

  getAllAttendance(): Observable<Attendance[]> {
    return this.attendance$;
  }

  getTodayAttendance(): Observable<Attendance[]> {
    return of(this.mockAttendance);
  }

  getStats(): Observable<AttendanceStats> {
    const stats: AttendanceStats = {
      totalStaff: 8,
      presentToday: 7,
      absent: 0,
      lateArrivals: 0,
      onLeave: 1,
      attendanceRate: 68.8,
      lateArrivalRate: 15.9
    };
    return of(stats);
  }

  getRecentCheckIns(): Observable<RecentCheckIn[]> {
    const recent: RecentCheckIn[] = [
      { name: 'Sarah Johnson', time: '09:00', status: 'On time' },
      { name: 'Lisa Anderson', time: '09:00', status: 'On time' },
      { name: 'David Martinez', time: '09:00', status: 'On time' },
      { name: 'Emily Rodriguez', time: '08:00', status: 'On time' },
      { name: 'James Wilson', time: '08:00', status: 'On time' }
    ];
    return of(recent);
  }
}
