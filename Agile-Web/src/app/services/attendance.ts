import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Attendance, AttendanceStats, RecentCheckIn, AttendanceResponseDTO, AttendanceRequestDTO } from '../models/attendance';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/attendance`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

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
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendancesByDate(today).pipe(
      map(attendances => {
        // Count present (has arrival time)
        const presentToday = attendances.filter(a => a.checkIn).length;
        
        // Count late arrivals (after 9:00 AM)
        const lateArrivals = attendances.filter(a => {
          if (!a.checkIn) return false;
          const [hours, minutes] = a.checkIn.split(':').map(Number);
          return hours > 9 || (hours === 9 && minutes > 0);
        }).length;

        // For now, we'll need to get total staff from another service
        // This will be handled in the component
        return {
          totalStaff: 0, // Will be set by component
          presentToday,
          absent: 0, // Will be calculated in component
          lateArrivals,
          onLeave: 0, // Can be enhanced later
          attendanceRate: 0, // Will be calculated in component
          lateArrivalRate: presentToday > 0 ? (lateArrivals / presentToday) * 100 : 0
        };
      }),
      catchError(this.handleError)
    );
  }

  getRecentCheckIns(): Observable<RecentCheckIn[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendancesByDate(today).pipe(
      map(attendances => {
        // Filter attendances with check-in times and sort by time (most recent first)
        const checkIns = attendances
          .filter(a => a.checkIn)
          .map(a => {
            const [hours, minutes] = a.checkIn!.split(':').map(Number);
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
            const [hours, minutes] = item.attendance.checkIn!.split(':').map(Number);
            const isLate = hours > 9 || (hours === 9 && minutes > 0);
            return {
              name: item.attendance.staffName,
              time: item.attendance.checkIn!,
              status: isLate ? 'Late' : 'On time'
            };
          });
        return checkIns;
      }),
      catchError(this.handleError)
    );
  }
}
