import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss']
})
export class ButtonComponent {
  @Input() type: string = 'button';
  @Output() clicked = new EventEmitter<void>();

  isHovered: boolean = false;

  handleClick() {
    this.clicked.emit();
  }
}