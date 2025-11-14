import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { ParticipantDashboardComponent } from './components/dashboard/participant-dashboard/participant-dashboard.component';
// import { QuizComponent } from './components/participant/quiz/quiz.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'signup', component: AuthComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'participant-dashboard', component: ParticipantDashboardComponent }
  // { path: 'quiz/:subjectId', component: QuizComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
