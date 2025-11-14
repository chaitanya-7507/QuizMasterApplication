import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quiz-frontend';

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');

    // If user exists in localStorage → stay on the same page
    if (userData) {
      const user = JSON.parse(userData);

      // OPTIONAL: If user tries to open /login or /signup, redirect them to dashboard
      const currentUrl = this.router.url;

      if (currentUrl === '/login' || currentUrl === '/signup' || currentUrl === '/') {
        if (user.role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (user.role === 'Participant') {
          this.router.navigate(['/participant-dashboard']);
        }
      }
    }
  }
}
