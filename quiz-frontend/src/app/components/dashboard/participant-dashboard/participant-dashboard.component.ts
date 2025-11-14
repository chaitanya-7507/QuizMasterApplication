import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participant-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participant-dashboard.component.html',
  styleUrls: ['./participant-dashboard.component.css']
})
export class ParticipantDashboardComponent implements OnInit {
  currentYear = new Date().getFullYear();

  subjects: any[] = [];
  darkMode = false;
  participantName = '';
  participantEmail = '';
  showProfileMenu = false;
  showStats = false;

  stats = {
    totalQuizzes: 0,
    averageScore: 0,
    highestScore: 0
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.participantName = user.username || 'Participant';
    this.participantEmail = user.email || '';
    this.loadSubjects();
    this.loadStats();
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  loadSubjects() {
    this.http.get('http://localhost:5000/api/subjects').subscribe((res: any) => {
      this.subjects = res;
    });
  }

 startQuiz(subject: any) {
   this.router.navigate(['/quiz', subject._id]);
}


  loadStats() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.http.get(`http://localhost:5000/api/stats/${user._id}`).subscribe({
      next: (res: any) => (this.stats = res),
      error: () => {
        this.stats = { totalQuizzes: 0, averageScore: 0, highestScore: 0 };
      }
    });
  }

  viewStats() {
    this.showStats = true;
    this.showProfileMenu = false;
  }

  closeStats() {
    this.showStats = false;
  }
}
