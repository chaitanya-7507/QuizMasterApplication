import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Question type
interface Question {
  _id: string;
  questionText: string;
  options: { [key: string]: string }; 
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
  userAnswers: { [key: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.subjectId = this.route.snapshot.paramMap.get('subjectId')!;
    this.fetchQuestions();
  }

  // 🔀 Shuffle helper
  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Fetch and shuffle options
  fetchQuestions() {
    this.http.get<Question[]>(`https://quizmasterapplication.onrender.com/api/quiz/${this.subjectId}`)
      .subscribe({
        next: (res) => {
          // 🔀 Shuffle options for each question
          this.questions = res.map((q) => {
            const entries = Object.entries(q.options);   // convert {a:'',b:''} → [['a',''],['b','']]
            const shuffled = this.shuffleArray(entries); // shuffle pairs
      
            const shuffledOptions: any = {};
            shuffled.forEach(([key, value]) => {
              shuffledOptions[key] = value;
            });

            return {
              ...q,
              options: shuffledOptions
            };
          });

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

  selectAnswer(optionKey: string) {
    this.selectedAnswer = optionKey;

    const currentQuestion = this.questions[this.currentQuestionIndex];

    this.userAnswers[this.currentQuestionIndex] = optionKey;
    this.answers[currentQuestion._id] = optionKey;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      const nextQuestion = this.questions[this.currentQuestionIndex];
      this.selectedAnswer = this.answers[nextQuestion._id] || null;
    } else {
      this.finishQuiz();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      const prevQuestion = this.questions[this.currentQuestionIndex];
      this.selectedAnswer = this.answers[prevQuestion._id] || null;
    }
  }

  finishQuiz() {
    this.quizCompleted = true;

    this.score = this.questions.reduce((acc, q) =>
      acc + (this.answers[q._id] === q.correctAnswer ? 1 : 0), 0
    );

    const result = {
      subjectId: this.subjectId,
      score: this.score,
      total: this.questions.length,
      percentage: Math.round((this.score / this.questions.length) * 100)
    };

    console.log('✅ Quiz finished:', result);
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.quizCompleted = false;
    this.selectedAnswer = null;
    this.answers = {};
  }

  isAttempted(qId: string): boolean {
    return !!this.answers[qId];
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
    this.selectedAnswer = this.userAnswers[index] || null;
  }

  backToDashboard() {
    this.router.navigate(['/participant-dashboard']);
  }
}
