import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavRoute {
  path: string;
  name: string;
  icon?: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent {
  navRoutes: NavRoute[] = [
    { path: '/dashboard', name: 'Dashboard', icon: 'bi bi-speedometer2' },
    { path: '/transactions', name: 'Transactions', icon: 'bi bi-list' },
  ];
} 