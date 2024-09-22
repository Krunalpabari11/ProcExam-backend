# My API Documentation

## Overview

This API allows users to authenticate, manage quizzes, and evaluate quiz submissions. It uses JWT tokens for authentication, which are stored securely in cookies. Kafka is implemented for efficient message processing.

## For Swagger

- Hit the url /api-docs

## API Endpoints

### 1. **User Authentication**

- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Summary:** Login a user.
- **Parameters:**
  - **Body:**
    - `username`: string (example: "playpowerlabs")
    - `password`: string (example: "playpowerlabs")
- **Responses:**
  - `200`: Successful login
  - `401`: Unauthorized

### 2. **Evaluate Quiz Submission**

- **Endpoint:** `/api/evaluate`
- **Method:** `POST`
- **Summary:** Evaluate a quiz submission.
- **Parameters:**
  - **Body:**
    - `quizId`: string (example: "12345")
    - `answers`: array of objects containing:
      - `questionId`: string (example: "q1")
      - `answer`: string (example: "A")
- **Responses:**
  - `200`: Quiz evaluated successfully
  - `401`: Unauthorized
  - `400`: Bad request

### 3. **Generate a New Quiz**

- **Endpoint:** `/api/quiz/generateQuiz`
- **Method:** `POST`
- **Summary:** Generate a new quiz.
- **Parameters:**
  - **Body:**
    - `grade`: integer (example: 10)
    - `subject`: string (example: "Science")
    - `TotalQuestions`: number (example: 10)
    - `maxScore`: number (example: 10)
    - `Difficulty`: string (example: "EASY")
- **Responses:**
  - `200`: Quiz successfully generated
  - `401`: Unauthorized

### 4. **Filter Quizzes**

- **Endpoint:** `/api/quiz/filter`
- **Method:** `GET`
- **Summary:** Filter quizzes based on various criteria.
- **Parameters:**
  - `grade`: integer (optional)
  - `subject`: string (optional)
  - `minMarks`: integer (optional)
  - `completedDateFrom`: string (date format, optional)
  - `completedDateTo`: string (date format, optional)
- **Responses:**
  - `200`: List of filtered quizzes
  - `401`: Unauthorized

### 5. **Get All Submissions for a Quiz**

- **Endpoint:** `/api/quiz/getAllSubmission`
- **Method:** `GET`
- **Summary:** Get all submissions for a specific quiz ID.
- **Parameters:** None
- **Responses:**
  - `200`: Submissions data for the specified quiz ID
  - `401`: Unauthorized
  - `404`: Quiz not found

### 6. **Retry a Quiz**

- **Endpoint:** `/api/quiz/{quizId}/retry`
- **Method:** `GET`
- **Summary:** Retry a quiz and get questions data.
- **Parameters:**
  - `quizId`: string (required)
- **Responses:**
  - `200`: Quiz question data for retry
  - `401`: Unauthorized
  - `404`: Quiz not found

### 7. **Get a Hint for a Question**

- **Endpoint:** `/api/quiz/hint/{quizId}/{questionId}`
- **Method:** `GET`
- **Summary:** Get a hint for a specific quiz question.
- **Parameters:**
  - `quizId`: string (required)
  - `questionId`: string (required)
- **Responses:**
  - `200`: Hint for the specified quiz question
  - `401`: Unauthorized
  - `404`: Quiz or question not found

### 8. **Get All Submissions**

- **Endpoint:** `/api/quiz/getAllSubmission`
- **Method:** `GET`
- **Summary:** Get all submissions for a specific quiz ID.
- **Parameters:** None
- **Responses:**
  - `200`: Submissions data
  - `401`: Unauthorized

## Security

### JWT Tokens

- JWT tokens are used for authentication and are stored securely in cookies to enhance security against XSS attacks.

## Kafka Implementation

- Kafka is implemented for caching quizes for better efficiency of the server and faster output.

## Conclusion

This API provides a comprehensive solution for quiz management and user authentication. For further information, please refer to the individual endpoint documentation.
