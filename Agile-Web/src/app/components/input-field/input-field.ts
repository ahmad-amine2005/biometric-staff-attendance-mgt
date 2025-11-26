import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.scss']
})
export class InputFieldComponent {
  @Input() icon: 'user' | 'mail' | 'lock' = 'user';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  isFocused: boolean = false;

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  onInputChange(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
