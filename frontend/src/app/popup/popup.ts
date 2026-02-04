import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class PopupComponent {

  @Input() show = false;
  @Input() title = 'Message';
  @Input() message = '';


  @Input() redirectTo: string | null = null;

  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  onOk() {
    this.close.emit();

    if (this.redirectTo) {
      this.router.navigate([this.redirectTo]);
    }
  }
}
