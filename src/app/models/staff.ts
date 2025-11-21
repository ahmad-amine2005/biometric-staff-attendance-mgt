export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  shift: string;
  fingerprintRegistered: boolean;
  fingerprintTemplate?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  totalStaff: number;
  presentToday: number;
}