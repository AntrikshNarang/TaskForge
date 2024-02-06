# Project for DBMS - TaskForge : A Complete Task Management Application for Corporates

## Features

- **Project Management:** Create, manage, and organize projects with ease.
- **Task Assignment:** Assign tasks to team members and track their progress.
- **Collaboration:** Engage in real-time discussions with team members through comments.
- **File Management:** Upload and share files related to tasks within projects.
- **Notifications:** Stay updated with personalized notifications for task assignments, comments, and more.
- **Data Integrity:** Built with a reliable database schema to ensure data integrity and security.
- **Scalability:** Designed for scalability to accommodate growing teams and projects.

## Getting Started

To get started with TaskForge, follow these steps:

1. Clone the repository: `git clone https://github.com/antrikshnarang/TaskForge`
2. Navigate to the frontend and backend directory: `cd frontend` && `cd backend`
3. Install dependencies: `npm install`
4. Configure the database connection settings in `.env`. (sample .env.example provided)
5. Run the application frontend: `npm run dev`
5. Run the application backend: `nodemon server.js`
6. Access the application in your web browser at `http://localhost:5173/login`.

## Dependencies

TaskFlow Pro relies on the following dependencies:

- Node.js
- Express.js
- mysql (for DB)
- React (for the frontend)
- tailwind (CSS framework)

## Frontend Routes
- /login
- /signup
- /dashboard
- /admindashboard

## Backend APIs
### Auth
- /api/auth/createuser
- /api/auth/login
### User Dashboard
- /api/user/gettasks
- /api/taskcomplete/:id
### Admin Dashboard
- /api/admin/gettasks
- /api/admin/getprojects
- /api/admin/createproject
- /api/admin/getusers
- /api/admin/createtask