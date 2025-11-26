import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SignupComponent } from './pages/signup/signup';
import { Login } from './pages/login/login';

export const routes: Routes = [

  // Default root → signup
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full'
  },

  // Auth page (standalone, no layout)
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup')
        .then(m => m.SignupComponent) // ensure this is the exported name
  },


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
      },

    ]
  },

  {
    path: 'signup',
    component: SignupComponent
  },

  {
    path: 'login',
    component: Login
  },

  {
    // Fallback route - redirect any unknown path to dashboard
    path: '**',
    redirectTo: 'login'
  }

];
