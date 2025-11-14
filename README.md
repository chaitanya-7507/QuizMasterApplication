# 📘 QuizMaster Application

## 📌 Introduction
**QuizMaster** is a full-stack web application designed for managing and attempting quizzes.  
Admins can create and manage quizzes, while participants can log in and attempt quizzes securely.  
The system includes **JWT Authentication**, **Role-Based Access**, and a clean UI built using Angular.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|------|------------|-------------|
| **Frontend** | Angular 19.2.3 | User interface & routing |
| **Backend** | Node.js, Express.js | REST APIs & authentication |
| **Database** | MongoDB, Mongoose | Store users, quizzes, questions |
| **Auth** | JWT | Secure login & role validation |
| **Deployment** | Render | Cloud hosting of frontend & backend |
| **Styling** | HTML, CSS | UI design |
| **Package Manager** | npm | Dependency handling |

---

## 📁 Project Directory Structure

```QuizMasterApplication/
│
├── quiz-backend/
│ ├── models/
│ ├── routes/
│ ├── package-lock.json
│ ├── package.json
│ └── server.js
│
├── quiz-frontend/
│ └── src/
│ └── app/
│ ├── components/
│ │ ├── auth/
│ │ ├── dashboard/
│ │ │ ├── admin-dashboard/
│ │ │ └── participant-dashboard/
│ │ └── quiz/
│ ├── app-routing.module.ts
│ ├── app.component.css
│ ├── app.component.html
│ ├── app.component.spec.ts
│ ├── app.component.ts
│ ├── app.module.ts
│ ├── app.routes.ts
│ ├── index.html
│ ├── main.ts
│ ├── styles.css
│ ├── angular.json
│ ├── package-lock.json
│ ├── package.json
│ └── README.md
│
├── LICENSE
└── README.md
```
# © Copyright
© 2025 QuizMaster Application — All Rights Reserved.

# 📄 License
This project is licensed under the [MIT License](./LICENSE).
You are free to use, modify, and distribute the code with attribution.
