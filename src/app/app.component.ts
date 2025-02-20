import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataSeederService } from './services/data-seeder.service';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
})
export class AppComponent implements OnInit {
  title = 'Finance Tracker';

  constructor(private dataSeeder: DataSeederService) { }

  ngOnInit() {
    this.dataSeeder.seedData();
  }
}
