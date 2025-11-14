import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Question type
interface Question {
  _id: string;
  questionText: string;
  options: { [key: string]: string }; // example: { a: 'Option A', b: 'Option B' }
  correctAnswer: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  subjectId!: string;
  questions: Question[] = [];
  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  score = 0;
  quizCompleted = false;

  // Track selected answers
  answers: { [questionId: string]: string | null } = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.subjectId = this.route.snapshot.paramMap.get('subjectId')!;
    this.fetchQuestions();
  }

  // Fetch random questions for selected subject
  fetchQuestions() {
    this.http.get<Question[]>(`https://quizmasterapplication.onrender.com/api/quiz/${this.subjectId}`).subscribe({
      next: (res) => {
        this.questions = res;
        if (this.questions.length > 0) {
          this.selectedAnswer = this.answers[this.questions[0]._id] || null;
        }
      },
      error: (err) => {
        console.error('❌ Error fetching questions:', err);
        alert('No questions found for this subject.');
      }
    });
  }

  // When user selects an answer
  /*selectAnswer(optionKey: string) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.answers[currentQuestion._id] = optionKey;
    this.selectedAnswer = optionKey;
  }*/

  // Move to next question
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      const nextQuestion = this.questions[this.currentQuestionIndex];
      this.selectedAnswer = this.answers[nextQuestion._id] || null;
    } else {
      this.finishQuiz();
    }
  }

  // Move to previous question
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      const prevQuestion = this.questions[this.currentQuestionIndex];
      this.selectedAnswer = this.answers[prevQuestion._id] || null;
    }
  }

  // Quiz completion logic
  finishQuiz() {
    this.quizCompleted = true;

    // Calculate score
    this.score = this.questions.reduce((acc, q) => {
      return acc + (this.answers[q._id] === q.correctAnswer ? 1 : 0);
    }, 0);

    const result = {
      subjectId: this.subjectId,
      score: this.score,
      total: this.questions.length,
      percentage: Math.round((this.score / this.questions.length) * 100)
    };

    console.log('✅ Quiz finished:', result);
  }

  // Restart quiz
  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.quizCompleted = false;
    this.selectedAnswer = null;
    this.answers = {};
  }

  // Navigate directly to a question from status tracker
  /*goToQuestion(index: number) {
    this.currentQuestionIndex = index;
    const question = this.questions[index];
    this.selectedAnswer = this.answers[question._id] || null;
  }*/

  // Navigate back to participant dashboard
  backToDashboard() {
    this.router.navigate(['/participant-dashboard']);
  }

  // Helper: Check if a question has been attempted
  isAttempted(qId: string): boolean {
    return !!this.answers[qId];
  }
  userAnswers: { [key: number]: string } = {};

selectAnswer(optionKey: string) {
  this.selectedAnswer = optionKey;

  const currentQuestion = this.questions[this.currentQuestionIndex];
  
  // ✅ Save to both tracking objects
  this.userAnswers[this.currentQuestionIndex] = optionKey;
  this.answers[currentQuestion._id] = optionKey;
}


goToQuestion(index: number) {
  this.currentQuestionIndex = index;
  this.selectedAnswer = this.userAnswers[index] || null; // ✅ Restore if already selected
}
}

