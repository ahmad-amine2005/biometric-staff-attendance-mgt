import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./components/layout/layout')
      .then(m => m.Layout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard')
          .then(m => m.Dashboard)
      },
      {
        path: 'staff',
        loadComponent: () => import('./pages/staff-management/staff-management')
          .then(m => m.StaffManagement)
      },
      {
        path: 'attendance',
        loadComponent: () => import('./pages/attendance-records/attendance-records')
          .then(m => m.AttendanceRecords)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports')
          .then(m => m.Reports)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings')
          .then(m => m.Settings)
      }
    ]
  },
  {
    // Fallback route - redirect any unknown path to dashboard
    path: '**',
    redirectTo: 'dashboard'
  }
   

];
