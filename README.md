# Wellness 360

**Wellness 360** is a comprehensive health and lifestyle management platform designed to help users manage fitness, nutrition, physical activity, and healthy living through a single web application.

The platform combines fitness tracking, workout guidance, nutrition planning, posture analysis, health calculations, smartwatch-style monitoring, and an AI-powered fitness chatbot.

## Features

### 💪 Fitness & Workout Management

* Exercise and workout guidance
* Strength-training categories
* Workout resources for different muscle groups
* Weight-loss and weight-gain related fitness guidance
* Exercise-specific pages and resources

### 🧍 AI Posture Coach

* Webcam-based posture analysis
* Exercise posture monitoring
* Supports exercises such as:

  * Chest
  * Side Bends
  * Dumbbell Curls
  * Squats
* Uses MediaPipe Pose for pose detection
* Calculates body/joint angles
* Provides visual posture feedback
* Tracks exercise repetitions

### 🥗 Nutrition & Diet Management

* BMI calculation
* Calorie calculation
* Food information
* Diet planning
* Weight-loss and weight-gain guidance
* Seven-day diet planning functionality

### ⌚ Smartwatch-Style Health Dashboard

* Heart-rate information
* Steps
* Calories
* Sleep
* SpO₂
* Battery status
* Historical health information

### 🤖 AI Fitness Chatbot

* AI-powered fitness and lifestyle assistance
* Natural-language interaction
* Integrated using the Groq API
* Backend API securely handles the AI request

### 🔐 User Authentication

* User registration and login
* Password authentication
* JWT-based authentication
* Password hashing using bcrypt
* Forgot username/password functionality
* Password reset functionality

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* MediaPipe Pose
* Responsive web interface

### Backend

* Node.js
* Express.js
* REST APIs
* JWT
* bcrypt.js
* Mongoose

### Database

* MongoDB
* MongoDB Compass / MongoDB database tools

### APIs & Services

* Groq API
* MediaPipe Pose
* REST APIs

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman
* MongoDB

## Project Structure

```text
Wellness-360/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   ├── seedMeals.js
│   └── server.js
│
├── frontend/
│   ├── HTML pages
│   ├── JavaScript files
│   ├── CSS files
│   └── images
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Before running the project, install:

* Node.js
* npm
* MongoDB
* Git
* A modern web browser

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ShreyashBorkar01/Wellness-360.git
```

### 2. Open the project

```bash
cd Wellness-360
```

### 3. Install dependencies

Install the root dependencies:

```bash
npm install
```

Then install backend dependencies:

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` directory.

Use the provided example as a reference:

```text
backend/.env.example
```

## Running the Backend

From the `backend` directory:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

If your `package.json` uses a different start command, use the command defined in the backend `scripts` section.

## Running the Frontend

Open the frontend using a local development server.

For example, using VS Code Live Server:

1. Open the project in VS Code.
2. Open the `frontend` directory.
3. Open the required HTML page.
4. Select **Open with Live Server**.

The frontend communicates with the backend running on:

```text
http://localhost:5000
```

## Database

Wellness 360 uses MongoDB for storing application data.

The default local database configuration is:

```text
mongodb://127.0.0.1:27017/fitnessauth
```

Make sure MongoDB is running before starting the backend.

## Key Project Highlights

* Full-stack health and lifestyle management platform
* User authentication and authorization
* MongoDB-based data management
* REST API backend
* AI-powered fitness chatbot
* Computer-vision-based posture analysis
* Exercise repetition tracking
* Nutrition and calorie management
* BMI calculation
* Diet planning
* Smartwatch-style health dashboard
* Responsive web interface

## Future Improvements

* Cloud deployment
* Real-time smartwatch/BLE integration
* Advanced health analytics
* Personalized AI workout plans
* More computer-vision-based exercises
* Mobile application integration
* Cloud-based media storage
* Improved accessibility and responsive design

## Author

**Shreyash Borkar**

Bachelor of Engineering
A. C. Patil College of Engineering, Kharghar
Mumbai University

## License

This project is intended for educational and portfolio purposes.
