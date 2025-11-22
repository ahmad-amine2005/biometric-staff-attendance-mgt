import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Staff, Department } from '../models/staff';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  
 private staffSubject = new BehaviorSubject<Staff[]>([]);
  public staff$ = this.staffSubject.asObservable();

  private mockStaff: Staff[] = [
    { id: '1', employeeId: 'EMP001', name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '+1234567890', department: 'Engineering', position: 'Senior Developer', shift: '09:00 - 17:00', fingerprintRegistered: true, avatar: 'SJ', createdAt: new Date() },
    { id: '2', employeeId: 'EMP002', name: 'Michael Chen', email: 'michael.c@company.com', phone: '+1234567891', department: 'Engineering', position: 'DevOps Engineer', shift: '09:00 - 17:00', fingerprintRegistered: true, avatar: 'MC', createdAt: new Date() },
    { id: '3', employeeId: 'EMP003', name: 'Emily Rodriguez', email: 'emily.r@company.com', phone: '+1234567892', department: 'Human Resources', position: 'HR Manager', shift: '08:30 - 16:30', fingerprintRegistered: true, avatar: 'ER', createdAt: new Date() },
    { id: '4', employeeId: 'EMP004', name: 'James Wilson', email: 'james.w@company.com', phone: '+1234567893', department: 'Sales', position: 'Sales Director', shift: '08:00 - 16:00', fingerprintRegistered: true, avatar: 'JW', createdAt: new Date() },
    { id: '5', employeeId: 'EMP005', name: 'Lisa Anderson', email: 'lisa.a@company.com', phone: '+1234567894', department: 'Marketing', position: 'Marketing Lead', shift: '09:00 - 17:00', fingerprintRegistered: true, avatar: 'LA', createdAt: new Date() },
    { id: '6', employeeId: 'EMP006', name: 'David Martinez', email: 'david.m@company.com', phone: '+1234567895', department: 'Engineering', position: 'Frontend Developer', shift: '09:00 - 17:00', fingerprintRegistered: true, avatar: 'DM', createdAt: new Date() },
    { id: '7', employeeId: 'EMP007', name: 'Jessica Taylor', email: 'jessica.t@company.com', phone: '+1234567896', department: 'Operations', position: 'Operations Manager', shift: '08:00 - 16:00', fingerprintRegistered: false, avatar: 'JT', createdAt: new Date() },
    { id: '8', employeeId: 'EMP008', name: 'Robert Brown', email: 'robert.b@company.com', phone: '+1234567897', department: 'Sales', position: 'Account Executive', shift: '08:30 - 16:30', fingerprintRegistered: true, avatar: 'RB', createdAt: new Date() }
  ];

  constructor() {
    this.staffSubject.next(this.mockStaff);
  }

  getAllStaff(): Observable<Staff[]> {
    return this.staff$;
  }

  getStaffById(id: string): Observable<Staff | undefined> {
    return of(this.mockStaff.find(s => s.id === id));
  }

  addStaff(staff: Omit<Staff, 'id' | 'createdAt'>): Observable<Staff> {
    const newStaff: Staff = { 
      ...staff, 
      id: Date.now().toString(), 
      createdAt: new Date() 
    };
    this.mockStaff.push(newStaff);
    this.staffSubject.next(this.mockStaff);
    return of(newStaff);
  }

  updateStaff(id: string, staff: Partial<Staff>): Observable<Staff | null> {
    const index = this.mockStaff.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockStaff[index] = { ...this.mockStaff[index], ...staff };
      this.staffSubject.next(this.mockStaff);
      return of(this.mockStaff[index]);
    }
    return of(null);
  }

  deleteStaff(id: string): Observable<boolean> {
    const index = this.mockStaff.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockStaff.splice(index, 1);
      this.staffSubject.next(this.mockStaff);
      return of(true);
    }
    return of(false);
  }

  registerFingerprint(staffId: string, fingerprintData: string): Observable<boolean> {
    const index = this.mockStaff.findIndex(s => s.id === staffId);
    if (index !== -1) {
      this.mockStaff[index].fingerprintRegistered = true;
      this.mockStaff[index].fingerprintTemplate = fingerprintData;
      this.staffSubject.next(this.mockStaff);
      return of(true);
    }
    return of(false);
  }

  getDepartments(): Observable<Department[]> {
    const departments: Department[] = [
      { id: '1', name: 'Engineering', totalStaff: 3, presentToday: 2 },
      { id: '2', name: 'Sales', totalStaff: 2, presentToday: 2 },
      { id: '3', name: 'Marketing', totalStaff: 1, presentToday: 1 },
      { id: '4', name: 'Human Resources', totalStaff: 1, presentToday: 1 },
      { id: '5', name: 'Operations', totalStaff: 1, presentToday: 1 }
    ];
    return of(departments);
  }
}