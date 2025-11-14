import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { routes } from './app.routes';
import { QuizComponent } from './components/quiz/quiz.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forRoot(routes),
    AuthComponent,
    QuizComponent
 ],
  bootstrap: [AppComponent]
})
export class AppModule {}
