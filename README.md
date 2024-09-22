# Online Judge System

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Security](#security)
- [Workflow](#workflow)
- [Admin Features](#admin-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Production Deployment](#production-deployment)
- [Future Scope](#future-scope)

## Overview
The Online Judge System is a web platform designed for code compilation and evaluations. Users can compiler code and also submit solutions to various problems, which are evaluated against predefined test cases in a secure environment. The system provides real-time feedback on submissions, including verdicts and leaderboard rankings for top performers.

## Key Features
- **Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
- **Problem Management**: Users can view a list of coding problems, including detailed problem statements, input/output specifications, and difficulty levels.
- **Code Submission**: Users submit code for evaluation; each submission is processed in isolated Docker containers to ensure security and environment consistency.
- **Result Evaluation**: Automated evaluation of code submissions, with results stored and displayed, providing instant feedback to users.
- **Leaderboard**: A ranked list of users based on their problem-solving performance.
- **User Profile**: Users can manage their profile, view their submission history, and track their performance.
- **Admin Dashboard**: Admins can manage problems and users activity.

## Architecture
- **Frontend**: Developed using **React.js** and **Vite** for a responsive and interactive user interface, deployed via **Vercel**.
- **Backend**: Built using **Express.js (Node.js)** to handle API requests and manage code submissions.
- **Database**: **MongoDB Atlas** (free tier) is used to store user data, problem sets, test cases, and submission results.
- **Containerization**: The backend and compiler servers are containerized using **Docker** and deployed on **AWS EC2**.
- **Reverse Proxy**: **Nginx** is used as a reverse proxy to route traffic efficiently between services.

## Deployment
- **Frontend**: Deployed via **Vercel**.
- **Backend**: Deployed on an **AWS EC2 instance** using Docker. Both the backend and compiler services run as separate containers in the same EC2 instance.
- **Reverse Proxy**: **Nginx** is used to route traffic between the frontend and backend services.

## Security
- **Security**: 
  - Use **docker container** for compile code.
  - Secure data transmission via **HTTPS**.
  - User authentication and session management using **JWT**.

## Workflow
1. **Registration/Login**: Users create an account or log in and are authenticated using JWT.
2. **Problem Interaction**: Users browse a list of problems and select a problem to solve, viewing detailed problem statements, inputs, and outputs.
3. **Code Submission**: Users write code in one of five supported languages (C++, Java, Python, Go, JavaScript) and submit their solution. The code is run in a Docker container, evaluated against predefined test cases.
4. **Result Display**: After submission, users can view real-time results for their code, including accepted/wrong answer status for each test case.
5. **Leaderboard and Profile**: Users can check their ranking on the leaderboard and view their submission history in their profile.

## Admin Features
- **Admin Dashboard**: Accessible only by admins after authentication. Admins can:
  - Add, edit, or delete coding problems.
  - Manage users and other admins.

## Getting Started

### Prerequisites
- **Node.js** and **npm** (for the backend)
- **Docker** (for containerization)
- **MongoDB Atlas** (for the database)

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chirag-memariya/online-judge.git
   cd online-judge
   ```

2. **Install dependencies for frontend**:

   Frontend:
   ```bash
   cd frontend
   npm install
   ```

3. **Environment variables**: Create a `.env` file in the root of the backend directory and add the necessary environment variables, including the MongoDB URI, JWT secret, and any other configuration for your Docker setup.

4. **Run Docker containers**: Ensure Docker is running and use Docker to start the backend and compiler servers:

   Backend:
   ```bash
   cd backend
   docker build -t backend-server .
   docker run -p 8080:8080 backend-server
   ```
   Compiler:
   ```bash 
   cd compiler
   docker build -t compiler-server
   docker run -p 5000:5000 compiler-server
   ```

5. **Access the application**: Open your browser and visit `http://localhost:5173` to interact with the frontend. The backend will be running on `http://localhost:8000`(backend server) and `http://localhost:5000`.

### Production Deployment

1. **Frontend Deployment**:
   - Connect your GitHub repository to Vercel.
   - Configure the necessary environment variables in Vercel.
   - Deploy the frontend through Vercel's automated process.

2. **Backend and Compiler Deployment**:
   - Set up an AWS EC2 instance.
   - Install Docker on the EC2 instance.
   - Clone your repository on the EC2 instance:
     ```bash
     git clone https://github.com/chirag-memariya/online-judge.git
     cd online-judge
     ```
   - Build and run your Docker containers:
     ```bash
     cd backend
     docker build -t backend-server .
     docker run -d -p 8080:8080 backend-server

     cd ../compiler
     docker build -t compiler-server .
     docker run -d -p 5000:5000 compiler-server
     ```

3. **Database Setup**:
   - Set up a MongoDB Atlas cluster.
   - Configure the connection string in your backend's environment variables.

4. **Nginx Setup**:
   - Install and configure Nginx on your EC2 instance to act as a reverse proxy.
   - Set up SSL certificates for HTTPS.
   - Configure Nginx to route traffic to your Docker containers

5. **Final Steps**:
   - Ensure all environment variables are correctly set for the production environment.

## Future Scope

1. **Caching**: 
   - Implement Redis for caching frequently accessed data like leaderboard results or problem statements.
   - This will significantly improve response times and reduce database load.

2. **Store Previous Code**:
   - Allow users to access and reuse their previously written code.
   - This feature will enhance user experience by providing quick access to past submissions.

3. **Timer Implementation**:
   - Add an optional timer feature for users to track the time taken for code submissions.
   - This will ensure timely evaluation and add a competitive element for users who wish to optimize their solving speed.

4. **Message Queue**:
   - Implement a message queue system (e.g., RabbitMQ) to handle high volumes of code submissions simultaneously.
   - Submissions will be queued and processed asynchronously, effectively managing the "thundering herd" problem during peak usage times.

5. **Scalability Enhancements**:
   - Further optimize the system for horizontal scaling to handle increased user load.
   - Implement more advanced load balancing techniques to distribute traffic efficiently across multiple servers.

These future enhancements will focus on improving system performance, user experience, and scalability to accommodate growing user bases and increasing complexity of coding challenges.