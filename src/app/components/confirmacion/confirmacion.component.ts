import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.scss'
})
export class ConfirmacionComponent {
  private route = inject(ActivatedRoute);
  orderId: string | null = null;

  constructor() {
    this.orderId = this.route.snapshot.paramMap.get('id');
  }
}