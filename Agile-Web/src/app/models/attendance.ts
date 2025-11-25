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
