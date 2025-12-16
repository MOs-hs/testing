# Khadamati

A home services platform built as a university senior project. Connects customers with local service providers (plumbing, electrical, cleaning, carpentry).

## Status

- Core features working: authentication, service listings, requests, reviews
- Admin panel functional for managing users and services
- Known issue: review submission may fail for some request states (debugging in progress)

## Implemented Features

**Authentication & Users**
- Registration and login for customers and providers
- JWT-based authentication with role-based access (customer, provider, admin)
- Profile management

**Services**
- Browse and search services by category
- Service details with provider info and ratings
- Providers can create and manage their service listings

**Requests**
- Customers can request services with scheduling
- Providers can accept/reject and update request status
- Status workflow: Pending → Accepted → In Progress → Completed

**Reviews**
- Customers can review completed services
- Ratings (1-5 stars) with comments
- Provider ratings calculated from reviews

**Notifications**
- Database-stored notifications for users
- Mark as read, view unread count
- Note: notifications are fetched on page load, not pushed in real-time

**Admin Panel**
- View and manage all users, providers, services
- Handle service requests and reviews
- Dashboard with basic statistics

**UI Features**
- Multi-language support (Arabic and English)
- Dark/light mode toggle
- Responsive design with Tailwind CSS

## Not Documented / Out of Scope

- Payments routes exist in backend (`/api/payments`) but are not documented here (incomplete / not used in current demo)
- Map integration (dependencies present but component removed)

## Tech Stack

**Frontend**
- React 18.2.0 (Create React App)
- React Router 6.26.0
- Tailwind CSS 3.4.1
- react-i18next for translations
- Axios for API calls

**Backend**
- Node.js with Express 4.18.2
- MySQL via mysql2
- JWT for authentication
- bcryptjs for password hashing

## Local Setup

1. Clone and install dependencies:
```bash
git clone https://github.com/MOs-hs/testing.git
cd testing
npm run install-all
```

2. Import database:
   - Start XAMPP (MySQL)
   - Open phpMyAdmin at http://localhost/phpmyadmin
   - Create database `khadamati` or import `KHADAMATI.sql` directly

3. Configure backend:
```bash
cd backend
cp .env.example .env
# Edit .env if needed (defaults work with XAMPP)
```

4. Run the application:
```bash
# From root directory
npm run dev
```

5. Access:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/api/health

## Environment Variables

Create `backend/.env` with:
- `NODE_ENV` - development or production
- `PORT` - backend port (default: 5000)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MySQL connection
- `JWT_SECRET` - secret key for tokens
- `JWT_EXPIRE` - token expiration (e.g., 7d)

## API Overview

**Route Groups**
- `/api/auth` - login, register
- `/api/users` - user profiles
- `/api/categories` - service categories
- `/api/services` - service listings
- `/api/requests` - service requests
- `/api/reviews` - customer reviews
- `/api/notifications` - user notifications
- `/api/providers` - provider profiles
- `/api/admin` - admin operations
- `/api/contact` - contact form submissions

**Example Requests**

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "yourpassword"}'
```

Get services (protected):
```bash
curl http://localhost:5000/api/services \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database

Import `KHADAMATI.sql` into MySQL. Database name: `khadamati`

Tables: user, customer, provider, admin, category, service, servicerequest, status, review, notification, certificate, serviceimage, reports

## Team

Senior project - [Add team member names and university/semester info here]
