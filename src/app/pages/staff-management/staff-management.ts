import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../services/staff';
import { Staff } from '../../models/staff';

@Component({
  selector: 'app-staff-management',
   standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.scss',
})
export class StaffManagement implements OnInit {

   staff: Staff[] = [];
  searchQuery: string = '';
  showAddModal: boolean = false;
  showFingerprintModal: boolean = false;
  selectedStaff: Staff | null = null;
  isScanning: boolean = false;

  newStaff: Partial<Staff> = {
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    position: '',
    shift: '',
    fingerprintRegistered: false
  };

  constructor(private staffService: StaffService) {}

  ngOnInit() {
    this.loadStaff();
  }

  loadStaff() {
    this.staffService.getAllStaff().subscribe(staff => {
      this.staff = staff;
    });
  }

  get filteredStaff(): Staff[] {
    if (!this.searchQuery) return this.staff;
    const query = this.searchQuery.toLowerCase();
    return this.staff.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.employeeId.toLowerCase().includes(query) ||
      s.department.toLowerCase().includes(query)
    );
  }

  openAddModal() {
    this.showAddModal = true;
    this.newStaff = {
      name: '',
      email: '',
      phone: '',
      employeeId: '',
      department: '',
      position: '',
      shift: '09:00 - 17:00',
      fingerprintRegistered: false
    };
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveStaff() {
    if (this.newStaff.name && this.newStaff.employeeId) {
      this.staffService.addStaff(this.newStaff as Omit<Staff, 'id' | 'createdAt'>).subscribe(() => {
        this.closeAddModal();
        this.loadStaff();
      });
    }
  }

  deleteStaff(id: string) {
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.staffService.deleteStaff(id).subscribe(() => {
        this.loadStaff();
      });
    }
  }

  openFingerprintModal(staff: Staff) {
    this.selectedStaff = staff;
    this.showFingerprintModal = true;
    this.isScanning = false;
  }

  closeFingerprintModal() {
    this.showFingerprintModal = false;
    this.selectedStaff = null;
  }

  startFingerprintScan() {
    this.isScanning = true;
    setTimeout(() => {
      if (this.selectedStaff) {
        this.staffService.registerFingerprint(
          this.selectedStaff.id, 
          'fingerprint_template_' + Date.now()
        ).subscribe(() => {
          this.isScanning = false;
          this.closeFingerprintModal();
          this.loadStaff();
        });
      }
    }, 3000);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

}
