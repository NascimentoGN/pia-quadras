import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { BookingDetailsComponent } from './pages/booking-details/booking-details.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminCourtsComponent } from './pages/admin-courts/admin-courts.component'; // <-- NOVO

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'booking-details/:id', component: BookingDetailsComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/courts', component: AdminCourtsComponent } // <-- NOVA ROTA
];