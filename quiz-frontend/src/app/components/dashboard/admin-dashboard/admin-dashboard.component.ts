import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentYear = new Date().getFullYear();
  subjectForm!: FormGroup;
  questionForm!: FormGroup;
  subjects: any[] = [];
  users: any[] = [];
  questions: any[] = [];

  showQuestionsPage = false;

  editMode = false;
  selectedSubjectId: string | null = null;
  selectedQuestionId: string | null = null;

  darkMode = false;

  // For subject overview
  selectedOverviewSubject: string | null = null;
  subjectName: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      timer: [10, [Validators.required, Validators.min(1)]]
    });

    this.questionForm = this.fb.group({
      subject: ['', Validators.required],
      questionText: ['', Validators.required],
      codeSnippet: [''],
      options: this.fb.group({
        a: ['', Validators.required],
        b: ['', Validators.required],
        c: ['', Validators.required],
        d: ['', Validators.required]
      }),
      correctAnswer: ['', Validators.required]
    });

    this.loadSubjects();
    this.loadUsers();
    this.loadQuestions();
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  // Load all subjects
  loadSubjects() {
    this.http.get('https://quizmasterapplication.onrender.com/api/subjects').subscribe((res: any) => {
      this.subjects = res;
    });
  }

  // Load all users
  loadUsers() {
    this.http.get('https://quizmasterapplication.onrender.com/api/users').subscribe((res: any) => {
      this.users = res;
    });
  }

  // Load all questions
  loadQuestions() {
    this.http.get('https://quizmasterapplication.onrender.com/api/questions').subscribe((res: any) => {
      this.questions = res;
    });
  }

  // Add or Update Subject
  saveSubject() {
    if (this.subjectForm.invalid) return;
    const data = this.subjectForm.value;

    if (this.editMode && this.selectedSubjectId) {
      this.http.put(`https://quizmasterapplication.onrender.com/api/subjects/${this.selectedSubjectId}`, data).subscribe({
        next: () => {
          alert('✅ Subject updated!');
          this.resetSubjectForm();
          this.loadSubjects();
        },
        error: err => console.error(err)
      });
    } else {
      this.http.post('https://quizmasterapplication.onrender.com/api/subjects', data).subscribe({
        next: () => {
          alert('✅ Subject added!');
          this.resetSubjectForm();
          this.loadSubjects();
        },
        error: err => console.error(err)
      });
    }
  }

  editSubject(subject: any) {
    this.editMode = true;
    this.selectedSubjectId = subject._id;
    this.subjectForm.patchValue(subject);
  }

  resetSubjectForm() {
    this.subjectForm.reset({ timer: 10 });
    this.editMode = false;
    this.selectedSubjectId = null;
  }

  deleteSubject(id: string) {
    if (!confirm('Delete this subject?')) return;
    this.http.delete(`https://quizmasterapplication.onrender.com/api/subjects/${id}`).subscribe(() => {
      alert('🗑️ Subject deleted');
      this.loadSubjects();
    });
  }

  // Add or Update Question
  saveQuestion() {
    if (this.questionForm.invalid) return;
    const data = this.questionForm.value;

    if (this.selectedQuestionId) {
      this.http.put(`https://quizmasterapplication.onrender.com/api/questions/${this.selectedQuestionId}`, data).subscribe({
        next: () => {
          alert('✅ Question updated!');
          this.resetQuestionForm();
          this.loadQuestions();
        },
        error: err => console.error(err)
      });
    } else {
      this.http.post('https://quizmasterapplication.onrender.com/api/questions', data).subscribe({
        next: () => {
          alert('✅ Question added!');
          this.resetQuestionForm();
          this.loadQuestions();
        },
        error: err => console.error(err)
      });
    }
  }

  editQuestion(question: any) {
    this.selectedQuestionId = question._id;
    this.questionForm.patchValue({
      subject: question.subject?._id || question.subject,
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer
    });
  }

  resetQuestionForm() {
    this.questionForm.reset();
    this.selectedQuestionId = null;
  }

  deleteQuestion(id: string) {
    if (!confirm('Delete this question?')) return;
    this.http.delete(`https://quizmasterapplication.onrender.com/api/questions/${id}`).subscribe(() => {
      alert('🗑️ Question deleted');
      this.loadQuestions();
    });
  }

  // View Questions by Subject
  onSelectSubject(subjectId: string) {
    this.selectedOverviewSubject = subjectId;
    const selected = this.subjects.find(s => s._id === subjectId);
    this.subjectName = selected ? selected.name : '';
  }

  getQuestionsForSelectedSubject() {
    if (!this.selectedOverviewSubject) return [];
    return this.questions.filter(q => q.subject?._id === this.selectedOverviewSubject);
  }

  // Delete user
  deleteUser(id: string) {
    if (!confirm('Delete this user?')) return;
    this.http.delete(`https://quizmasterapplication.onrender.com/api/users/${id}`).subscribe(() => {
      alert('🗑️ User deleted');
      this.loadUsers();
    });
  }

  // Logout
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // ==========================================================
  // 🧠 Inline Question Editing (Modal)
  // ==========================================================
  isEditingQuestion = false;
  questionToEdit: any = {
    _id: '',
    questionText: '',
    options: { a: '', b: '', c: '', d: '' },
    correctAnswer: ''
  };

  // ✏️ Open modal for inline question editing
  startEditingQuestion(q: any) {
    this.isEditingQuestion = true;
    this.questionToEdit = JSON.parse(JSON.stringify(q)); // deep copy to avoid direct binding
  }

  // 💾 Save inline question update
  updateQuestionInline() {
    if (!this.questionToEdit || !this.questionToEdit._id) return;

    this.http.put(`https://quizmasterapplication.onrender.com/api/questions/${this.questionToEdit._id}`, this.questionToEdit).subscribe({
      next: () => {
        alert('✅ Question updated successfully!');
        this.isEditingQuestion = false;
        this.questionToEdit = {
          _id: '',
          questionText: '',
          options: { a: '', b: '', c: '', d: '' },
          correctAnswer: ''
        };
        this.loadQuestions();
      },
      error: (err) => {
        console.error('Error updating question:', err);
        alert('❌ Failed to update question.');
      }
    });
  }

  // ❌ Cancel inline question editing
  cancelEditingQuestion() {
    this.isEditingQuestion = false;
    this.questionToEdit = {
      _id: '',
      questionText: '',
      options: { a: '', b: '', c: '', d: '' },
      correctAnswer: ''
    };
  }
  showQuestions: boolean = false;

toggleQuestions() {
  this.showQuestions = !this.showQuestions;
}

}
