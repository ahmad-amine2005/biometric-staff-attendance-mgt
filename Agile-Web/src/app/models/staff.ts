export interface Staff {
  userId: number;
  name: string;
  surname: string;
  email: string;
  role?: string;
  active?: boolean;
  noAbsence?: number;
  departmentId: number;
  departmentName: string;
  contractId?: number;
  contractStatus?: string;
  totalAttendances?: number;
}

export interface StaffRequest {
  name: string;
  surname: string;
  email: string;
  departmentId: number;
  noDaysPerWeek_contract: number;
  startTime_contract: string;
  endTime_contract: string;
}

export interface StaffUpdate {
  name?: string;
  surname?: string;
  email?: string;
  departmentId?: number;
  noAbsence?: number;
  active?: boolean;
}

export interface Department {
  id: string;
  name: string;
  totalStaff: number;
  presentToday: number;
}