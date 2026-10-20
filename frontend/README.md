# DevPulse

DevPulse is a full-stack, single-page social feed application designed for developers to share project updates, engage with posts, and explore user profiles. Built with a decoupled architecture featuring a Django REST Framework backend and a React (Vite) frontend.

---

## Features

- **Authentication & Security:** User registration, login, token-based session persistence, and backend permission checks (`403 Forbidden`).
- **Full CRUD Operations:** Authenticated users can create, edit, and delete their own posts. Unauthenticated users have read-only access.
- **Many-to-Many Relationships:** Real-time post like toggling with dynamic counters and user-state tracking (`is_liked`).
- **Client-Side Routing & Profiles:** Filter feed posts dynamically by clicking `@username` handles without full page reloads.
- **Dark Mode UI:** Responsive, custom CSS interface built with CSS variables and Flexbox alignment.
- **Automated Test Suite:** Django backend unit tests covering API endpoints, authorization guards, and database constraints.

---

## Tech Stack

- **Backend:** Python, Django, Django REST Framework, SQLite, Token Authentication
- **Frontend:** JavaScript (ES6+), React 18, Vite, CSS3
- **Testing:** Django Test Framework (`unittest`)

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### Backend Setup (Django REST API)

1. Navigate to the backend directory:
   ```bash
   cd core # or root folder containing manage.py
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run database migrations:
   ```bash
   python manage.py migrate
   ```
5. Run the development server:
   ```bash
   python manage.py runserver
   ```
   The API will be running at `http://127.0.0.1:8000/`.

---

### Frontend Setup (React / Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Running Tests

To run the backend unit test suite:

```bash
python manage.py test
```