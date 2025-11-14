import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  form!: FormGroup;
  roles = ['Admin', 'Participant'];
  loginMode = true; // default: login

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.form = this.fb.group({
      role: ['', Validators.required],
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/)
        ]
      ]
    });

    // Switch between login/signup based on route
    this.route.url.subscribe(segments => {
      this.loginMode = segments[0]?.path === 'login';
    });
  }

  get f() {
    return this.form.controls;
  }

  toggleMode() {
    this.router.navigate([this.loginMode ? '/signup' : '/login']);
  }

 onSubmit() {
  if (this.form.invalid) return;

  const apiUrl = 'https://quizmasterapplication.onrender.com/api/auth';
  const endpoint = this.loginMode ? '/login' : '/signup';

  this.http.post(apiUrl + endpoint, this.form.value).subscribe({
    next: (res: any) => {
        if (this.loginMode) {
        const selectedRole = this.form.value.role;
        const actualRole = res.user.role;

        if (selectedRole !== actualRole) {
            alert("Invalid credentials: Role mismatch!");
            localStorage.removeItem('user'); // remove saved wrong login
            return; // stop navigation
          }
        if (this.loginMode) {
        alert(res.message || 'Login successful');
        // Save user info
        localStorage.setItem('user', JSON.stringify(res.user));
        // Redirect based on role
        if (res.user.role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (res.user.role === 'Participant') {
          this.router.navigate(['/participant-dashboard']);
        }
      } else {
        alert(res.message || 'Signup successful');
        this.router.navigate(['/login']);
      }
    },
    error: (err) => {
      alert(err.error?.message || 'Something went wrong!');
    }
  });
}

}



