import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../services/staff';
import { Staff, StaffRequest, StaffUpdate } from '../../models/staff';
import { DepartmentService, DepartmentResponse, DepartmentRequest } from '../../services/department.service';

@Component({
  selector: 'app-staff-management',
   standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.scss',
})
export class StaffManagement implements OnInit {

   staff: Staff[] = [];
  departments: DepartmentResponse[] = [];
  searchQuery: string = '';
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showFingerprintModal: boolean = false;
  showDepartmentModal: boolean = false;
  showEditDepartmentModal: boolean = false;
  selectedStaff: Staff | null = null;
  selectedDepartment: DepartmentResponse | null = null;
  isScanning: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  newStaff: StaffRequest = {
    name: '',
    surname: '',
    email: '',
    departmentId: 0,
    noDaysPerWeek_contract: 5,
    startTime_contract: '',
    endTime_contract: ''
  };

  editStaff: StaffUpdate = {
    name: '',
    surname: '',
    email: '',
    departmentId: 0,
    noAbsence: 0,
    active: true
  };

  newDepartment: DepartmentRequest = {
    dpmtName: ''
  };

  editDepartment: DepartmentRequest = {
    dpmtName: ''
  };

  constructor(
    private staffService: StaffService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadStaff();
    this.loadDepartments();
  }

  loadStaff() {
    this.isLoading = true;
    this.staffService.getAllStaff().subscribe({
      next: (staff) => {
        this.staff = staff;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load staff';
        this.isLoading = false;
        console.error('Error loading staff:', error);
      }
    });
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  get filteredStaff(): Staff[] {
    if (!this.searchQuery) return this.staff;
    const query = this.searchQuery.toLowerCase();
    return this.staff.filter(s => 
      s.name?.toLowerCase().includes(query) ||
      s.surname?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.departmentName?.toLowerCase().includes(query)
    );
  }

  openAddModal() {
    this.showAddModal = true;
    this.errorMessage = '';
    this.newStaff = {
      name: '',
      surname: '',
      email: '',
      departmentId: 0,
      noDaysPerWeek_contract: 5,
      startTime_contract: '',
      endTime_contract: ''
    };
  }

  closeAddModal() {
    this.showAddModal = false;
    this.errorMessage = '';
  }

  saveStaff() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Format datetime to match backend format (yyyy-MM-dd'T'HH:mm:ss)
    const staffRequest: StaffRequest = {
      ...this.newStaff,
      startTime_contract: this.formatDateTime(this.newStaff.startTime_contract),
      endTime_contract: this.formatDateTime(this.newStaff.endTime_contract)
    };

    this.staffService.createStaff(staffRequest).subscribe({
      next: () => {
        this.closeAddModal();
        this.loadStaff();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to create staff member';
        this.isLoading = false;
        console.error('Error creating staff:', error);
      }
    });
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    // datetime-local provides YYYY-MM-DDTHH:mm format
    // Backend expects yyyy-MM-dd'T'HH:mm:ss format
    // Add :00 for seconds if not present
    if (dateTimeString.length === 16) {
      return dateTimeString + ':00';
    }
    return dateTimeString;
  }

  validateForm(): boolean {
    if (!this.newStaff.name || !this.newStaff.surname || !this.newStaff.email) {
      this.errorMessage = 'Name, surname, and email are required';
      return false;
    }
    if (!this.newStaff.departmentId || this.newStaff.departmentId === 0) {
      this.errorMessage = 'Please select a department';
      return false;
    }
    if (!this.newStaff.startTime_contract || !this.newStaff.endTime_contract) {
      this.errorMessage = 'Contract start and end times are required';
      return false;
    }
    if (this.newStaff.noDaysPerWeek_contract <= 0) {
      this.errorMessage = 'Days per week must be greater than 0';
      return false;
    }
    return true;
  }

  deleteStaff(id: number) {
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.isLoading = true;
      this.staffService.deleteStaff(id).subscribe({
        next: () => {
          this.loadStaff();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to delete staff member';
          this.isLoading = false;
          console.error('Error deleting staff:', error);
        }
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
    // TODO: Implement actual fingerprint scanning integration
    setTimeout(() => {
      this.isScanning = false;
      this.closeFingerprintModal();
    }, 3000);
  }

  getInitials(name: string, surname?: string): string {
    const firstInitial = name ? name[0] : '';
    const lastInitial = surname ? surname[0] : '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  getFullName(staff: Staff): string {
    return `${staff.name || ''} ${staff.surname || ''}`.trim();
  }

  // Department CRUD Methods
  openDepartmentModal() {
    this.showDepartmentModal = true;
    this.errorMessage = '';
    this.newDepartment = { dpmtName: '' };
  }

  closeDepartmentModal() {
    this.showDepartmentModal = false;
    this.errorMessage = '';
  }

  saveDepartment() {
    if (!this.newDepartment.dpmtName || this.newDepartment.dpmtName.trim() === '') {
      this.errorMessage = 'Department name is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.departmentService.createDepartment(this.newDepartment).subscribe({
      next: () => {
        this.closeDepartmentModal();
        this.loadDepartments();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to create department';
        this.isLoading = false;
        console.error('Error creating department:', error);
      }
    });
  }

  openEditDepartmentModal(department: DepartmentResponse) {
    this.selectedDepartment = department;
    this.showEditDepartmentModal = true;
    this.errorMessage = '';
    this.editDepartment = { dpmtName: department.dpmtName };
  }

  closeEditDepartmentModal() {
    this.showEditDepartmentModal = false;
    this.selectedDepartment = null;
    this.errorMessage = '';
  }

  updateDepartment() {
    if (!this.selectedDepartment || !this.editDepartment.dpmtName || this.editDepartment.dpmtName.trim() === '') {
      this.errorMessage = 'Department name is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.departmentService.updateDepartment(this.selectedDepartment.dpmtId, this.editDepartment).subscribe({
      next: () => {
        this.closeEditDepartmentModal();
        this.loadDepartments();
        this.loadStaff(); // Reload staff to update department names
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to update department';
        this.isLoading = false;
        console.error('Error updating department:', error);
      }
    });
  }

  deleteDepartment(department: DepartmentResponse) {
    if (confirm(`Are you sure you want to delete the department "${department.dpmtName}"? This action cannot be undone if the department has staff members.`)) {
      this.isLoading = true;
      this.departmentService.deleteDepartment(department.dpmtId).subscribe({
        next: () => {
          this.loadDepartments();
          this.loadStaff();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to delete department';
          this.isLoading = false;
          console.error('Error deleting department:', error);
        }
      });
    }
  }

  // Staff Edit Methods
  openEditModal(staff: Staff) {
    this.selectedStaff = staff;
    this.showEditModal = true;
    this.errorMessage = '';
    this.editStaff = {
      name: staff.name || '',
      surname: staff.surname || '',
      email: staff.email || '',
      departmentId: staff.departmentId || 0,
      noAbsence: staff.noAbsence || 0,
      active: staff.active !== undefined ? staff.active : true
    };
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedStaff = null;
    this.errorMessage = '';
  }

  updateStaff() {
    if (!this.selectedStaff) return;

    if (!this.editStaff.name || !this.editStaff.surname || !this.editStaff.email) {
      this.errorMessage = 'Name, surname, and email are required';
      return;
    }

    if (!this.editStaff.departmentId || this.editStaff.departmentId === 0) {
      this.errorMessage = 'Please select a department';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.staffService.updateStaff(this.selectedStaff.userId, this.editStaff).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadStaff();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to update staff member';
        this.isLoading = false;
        console.error('Error updating staff:', error);
      }
    });
  }

}

