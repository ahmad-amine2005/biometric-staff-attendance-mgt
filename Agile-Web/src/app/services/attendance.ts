import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Attendance, AttendanceStats, RecentCheckIn, AttendanceResponseDTO, AttendanceRequestDTO } from '../models/attendance';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/attendance';

  private attendanceSubject = new BehaviorSubject<Attendance[]>([]);
  public attendance$ = this.attendanceSubject.asObservable();

  /**
   * Get all attendance records from the backend
   */
  getAllAttendance(): Observable<Attendance[]> {
    return this.http.get<AttendanceResponseDTO[]>(this.apiUrl).pipe(
      map(dtos => this.convertDTOsToAttendance(dtos)),
      catchError(this.handleError)
    );
  }

  /**
   * Get all attendance records as DTOs (raw backend response)
   */
  getAllAttendanceDTO(): Observable<AttendanceResponseDTO[]> {
    return this.http.get<AttendanceResponseDTO[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Record attendance (clock in/out)
   */
  recordAttendance(request: AttendanceRequestDTO): Observable<AttendanceResponseDTO> {
    return this.http.post<AttendanceResponseDTO>(`${this.apiUrl}/record`, request).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get attendance by ID
   */
  getAttendanceById(id: number): Observable<AttendanceResponseDTO> {
    return this.http.get<AttendanceResponseDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get attendances by date
   */
  getAttendancesByDate(date: string): Observable<Attendance[]> {
    return this.http.get<AttendanceResponseDTO[]>(`${this.apiUrl}/date/${date}`).pipe(
      map(dtos => this.convertDTOsToAttendance(dtos)),
      catchError(this.handleError)
    );
  }

  /**
   * Get attendances for a specific staff member
   */
  getStaffAttendances(staffId: number): Observable<Attendance[]> {
    return this.http.get<AttendanceResponseDTO[]>(`${this.apiUrl}/staff/${staffId}`).pipe(
      map(dtos => this.convertDTOsToAttendance(dtos)),
      catchError(this.handleError)
    );
  }

  /**
   * Get attendances by department
   */
  getAttendancesByDepartment(departmentId: number): Observable<Attendance[]> {
    return this.http.get<AttendanceResponseDTO[]>(`${this.apiUrl}/department/${departmentId}`).pipe(
      map(dtos => this.convertDTOsToAttendance(dtos)),
      catchError(this.handleError)
    );
  }

  /**
   * Get specific staff attendance for a specific date
   */
  getStaffAttendanceByDate(staffId: number, date: string): Observable<AttendanceResponseDTO | null> {
    return this.http.get<AttendanceResponseDTO>(`${this.apiUrl}/staff/${staffId}/date/${date}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(null); // Return null if not found
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Convert backend DTOs to frontend Attendance model
   */
  private convertDTOsToAttendance(dtos: AttendanceResponseDTO[]): Attendance[] {
    return dtos.map(dto => this.convertDTOToAttendance(dto));
  }

  /**
   * Convert a single DTO to Attendance model
   */
  private convertDTOToAttendance(dto: AttendanceResponseDTO): Attendance {
    const checkIn = dto.arrivalTime ? this.extractTime(dto.arrivalTime) : undefined;
    const checkOut = dto.departureTime ? this.extractTime(dto.departureTime) : undefined;
    const hoursWorked = this.calculateHoursWorked(dto.arrivalTime, dto.departureTime);
    const status = this.mapBackendStatusToFrontend(dto.status, dto.arrivalTime, dto.departureTime);

    return {
      id: dto.attendanceId.toString(),
      staffId: dto.staffId.toString(),
      staffName: `${dto.staffName} ${dto.staffSurname}`,
      department: dto.departmentName || 'Unassigned',
      date: new Date(dto.attendanceDate),
      checkIn,
      checkOut,
      hoursWorked,
      status
    };
  }

  /**
   * Extract time from datetime string (HH:mm format)
   */
  private extractTime(datetime: string): string {
    try {
      const date = new Date(datetime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return datetime; // Return as-is if parsing fails
    }
  }

  /**
   * Calculate hours worked between arrival and departure
   */
  private calculateHoursWorked(arrivalTime: string | null, departureTime: string | null): number {
    if (!arrivalTime || !departureTime) return 0;

    try {
      const arrival = new Date(arrivalTime);
      const departure = new Date(departureTime);
      const diffMs = departure.getTime() - arrival.getTime();
      const hours = diffMs / (1000 * 60 * 60);
      return Math.round(hours * 10) / 10; // Round to 1 decimal place
    } catch {
      return 0;
    }
  }

  /**
   * Map backend status to frontend status
   */
  private mapBackendStatusToFrontend(
    backendStatus: string,
    arrivalTime: string | null,
    departureTime: string | null
  ): 'present' | 'absent' | 'late' | 'leave' | 'half-day' {
    if (backendStatus === 'COMPLETE' || backendStatus === 'DEPARTURE_RECORDED') {
      // Check if late (after 9:00 AM)
      if (arrivalTime) {
        const arrival = new Date(arrivalTime);
        const hour = arrival.getHours();
        const minute = arrival.getMinutes();
        if (hour > 9 || (hour === 9 && minute > 0)) {
          return 'late';
        }
      }
      return 'present';
    } else if (backendStatus === 'ARRIVAL_RECORDED') {
      return 'present';
    } else if (backendStatus === 'INCOMPLETE') {
      return 'absent';
    }
    return 'present';
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.error || error.message || `Error Code: ${error.status}`;
    }

    console.error('AttendanceService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getTodayAttendance(): Observable<Attendance[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendancesByDate(today);
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
