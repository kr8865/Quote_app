# Quote Sharing Platform 📝

A full-stack MERN (MongoDB, Express, React, Node.js) web application that allows users to discover, share, and favorite inspirational quotes. The platform provides a sleek glassmorphism UI designed for an excellent user experience.

## Features ✨

### Authentication & Authorization
- **User Registration & Login:** JWT-based authentication flow with secure password hashing (bcrypt).
- **Protected Content:** Quotes are exclusively accessible to logged-in users.
- **Route Protection:** Only authenticated users can access the main quotes feed, create quotes, or view their profiles.

### Quotes Management
- **Discover:** Browse a rich feed of quotes with multiple categories (Inspirational, Life, Success, Wisdom, etc.).
- **Search & Filter:** Find specific quotes using keyword search (matches quote content and authors) and filter by category.
- **Create:** Share your favorite quotes with the community.
- **Edit & Delete (Authorization):** Users have strict inline editing and deleting permissions to modify only the quotes they have personally created.
- **Favorites System:** Users can 'like' quotes. The app tracks the total favorites count and allows users to browse their liked quotes in their profile.
- **Personal Profile:** A dedicated dashboard to view the quotes you've shared and the quotes you have favorited.

## Tech Stack 🛠️

- **Frontend:** React 18, Vite, React Router v6, Axios, Lucide React (for icons)
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT)
- **Database:** MongoDB, Mongoose
- **Styling:** Custom CSS with Glassmorphism principles and CSS variables for theming.

## Getting Started 🚀

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with a [MongoDB](https://www.mongodb.com/) database connection URI.

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and configure the environment variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:5000`.*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and access the application at `http://localhost:5173`.

## API Endpoints

### Authentication `/api/auth`
- `POST /register`: Register a new user
- `POST /login`: Authenticate standard login
- `GET /me`: Get current logged-in user details

### Quotes `/api/quotes`
- `GET /`: Fetch all quotes (Protected)
- `POST /`: Create a new quote (Protected)
- `PUT /:id`: Edit a quote (Protected, Owner only)
- `DELETE /:id`: Delete a quote (Protected, Owner only)
- `GET /myquotes`: Fetch all quotes created by the logged-in user (Protected)
- `PUT /:id/favorite`: Toggle favorite status on a quote (Protected)
