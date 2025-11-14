import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { ParticipantDashboardComponent } from './components/dashboard/participant-dashboard/participant-dashboard.component';
import { QuizComponent } from './components/quiz/quiz.component';

export const routes: Routes = [
  { path: '', component: AuthComponent }, // ← FIXED
  { path: 'login', component: AuthComponent },
  { path: 'signup', component: AuthComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'participant-dashboard', component: ParticipantDashboardComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'quiz/:subjectId', component: QuizComponent }
];
