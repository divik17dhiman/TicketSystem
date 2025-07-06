# Ticket Support System

A full-stack ticket support system built with React frontend and Node.js backend.

## Features

- User authentication (login/register)
- Create and manage support tickets
- Comment system for tickets
- Role-based access (customer, agent, admin)
- Real-time ticket status updates

## Tech Stack

**Frontend:**
- React
- React Router
- Context API for state management

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ticketsupportsystem
```

2. Install all dependencies:
```bash
npm run install-deps
```

3. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Update the MongoDB URI and other variables

4. Start the application:
```bash
npm start
```

This will start:
- Backend server on http://localhost:5000
- Frontend application on http://localhost:3000

### Individual Commands

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Tickets
- GET `/api/tickets` - Get all tickets
- POST `/api/tickets` - Create new ticket
- GET `/api/tickets/:id` - Get ticket by ID
- PUT `/api/tickets/:id` - Update ticket
- POST `/api/tickets/:id/comments` - Add comment to ticket

## Project Structure

```
ticketsupportsystem/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
│   └── public/
└── package.json
```

## Troubleshooting

### Common Issues

1. **Proxy Errors**: Make sure both backend and frontend are running. The frontend proxy is configured to redirect API calls to the backend.

2. **Connection Refused**: Ensure the backend server is running on port 5000 before starting the frontend.

3. **ESLint Warnings**: The project is configured to handle common ESLint rules for React development.

### Environment Setup

Make sure your `.env` file in the backend folder contains:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Running in Development

1. Start backend first:
```bash
cd backend && npm run dev
```

2. Then start frontend:
```bash
cd frontend && npm start
```

Or use the root command to start both:
```bash
npm start
```
