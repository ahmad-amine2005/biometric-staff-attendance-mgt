import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

   menuItems = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard' },
    { icon: '👥', label: 'Staff Management', route: '/staff' },
    { icon: '📋', label: 'Attendance Records', route: '/attendance' },
    { icon: '📈', label: 'Reports & Analytics', route: '/reports' },
    { icon: '⚙️', label: 'Settings', route: '/settings' }
  ];

  mobileMenuItem = { icon: '📱', label: 'Mobile Login', route: '/mobile-login' };

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
