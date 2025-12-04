export interface Attendance {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: Date;
  checkIn?: string;
  checkOut?: string;
  hoursWorked: number;
  status: 'present' | 'absent' | 'late' | 'leave' | 'half-day';
}

// Backend DTO Response Interface
export interface AttendanceResponseDTO {
  attendanceId: number;
  attendanceDate: string; // Format: "yyyy-MM-dd"
  arrivalTime: string | null; // Format: "yyyy-MM-ddTHH:mm:ss"
  departureTime: string | null; // Format: "yyyy-MM-ddTHH:mm:ss"
  staffId: number;
  staffName: string;
  staffSurname: string;
  staffEmail: string;
  departmentId: number | null;
  departmentName: string | null;
  status: 'ARRIVAL_RECORDED' | 'DEPARTURE_RECORDED' | 'COMPLETE' | 'INCOMPLETE';
}

// Request DTO for recording attendance
export interface AttendanceRequestDTO {
  staffId: number;
  attendanceDate: string; // Format: "yyyy-MM-dd"
  attendanceTime: string; // Format: "yyyy-MM-ddTHH:mm:ss"
}

export interface AttendanceStats {
  totalStaff: number;
  presentToday: number;
  absent: number;
  lateArrivals: number;
  onLeave: number;
  attendanceRate: number;
  lateArrivalRate: number;
}


export interface RecentCheckIn {
  name: string;
  time: string;
  status: string;
}
