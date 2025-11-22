import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {

   settings = {
    startTime: '09:00',
    endTime: '17:00',
    lateThreshold: 15,
    emailNotifications: true,
    lateArrivalAlerts: true,
    absenceAlerts: false,
    requireFingerprint: true,
    allowLocationTracking: false
  };

  saveChanges() {
    alert('Settings saved successfully!');
  }

}
