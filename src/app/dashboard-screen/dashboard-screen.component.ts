import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.css']
})
export class DashboardScreenComponent {
  selectedDays: number | undefined;



  days = [
    { id: 1, name: 'last 30 days' },
    { id: 2, name: 'last 60 days' },
    { id: 3, name: 'last 1 month' },
     ];
}
