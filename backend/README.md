# Khadamati Backend API

Complete REST API for the Khadamati home services platform built with Node.js, Express, and MySQL.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 Role-based access control (Admin, Provider, Customer)
- 📝 Complete CRUD operations for all entities
- ✅ Input validation with express-validator
- 🔒 Password hashing with bcrypt
- 📊 Admin dashboard with statistics and reporting
- 🔔 Real-time notifications
- ⭐ Review and rating system
- 💳 Payment management
- 📜 Provider certificates

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (via mysql2)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcryptjs, CORS

## Project Structure

```
backend/
├── config/
│   └── database.js          # MySQL connection pool
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── categoryController.js
│   ├── serviceController.js
│   ├── requestController.js
│   ├── reviewController.js
│   ├── paymentController.js
│   ├── notificationController.js
│   ├── providerController.js
│   └── adminController.js
├── models/
│   ├── User.js
│   ├── Category.js
│   ├── Service.js
│   ├── ServiceRequest.js
│   ├── Review.js
│   ├── Payment.js
│   ├── Notification.js
│   ├── Provider.js
│   ├── Customer.js
│   └── Certificate.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── categories.js
│   ├── services.js
│   ├── requests.js
│   ├── reviews.js
│   ├── payments.js
│   ├── notifications.js
│   ├── providers.js
│   └── admin.js
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Input validation
│   └── errorHandler.js      # Global error handling
├── .env                     # Environment variables
├── .env.example             # Environment template
├── server.js                # Entry point
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your settings:

```env
NODE_ENV=development
PORT=5000

# Database Configuration (XAMPP default)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=khadamati

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
```

### 3. Setup Database

1. Start XAMPP (Apache & MySQL)
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Import the `KHADAMATI.sql` file from the root directory
4. Verify that the `khadamati` database is created with all tables

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | Yes |
| GET | `/me` | Get current user | Yes |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all users | Yes | Admin |
| GET | `/:id` | Get user by ID | Yes | Any |
| PUT | `/:id` | Update user | Yes | Owner/Admin |
| DELETE | `/:id` | Delete user | Yes | Admin |
| PUT | `/:id/password` | Update password | Yes | Owner |

### Categories (`/api/categories`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all categories | No | - |
| GET | `/:id` | Get category by ID | No | - |
| POST | `/` | Create category | Yes | Admin |
| PUT | `/:id` | Update category | Yes | Admin |
| DELETE | `/:id` | Delete category | Yes | Admin |

### Services (`/api/services`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all services | No | - |
| GET | `/:id` | Get service by ID | No | - |
| GET | `/provider/:providerId` | Get provider services | No | - |
| POST | `/` | Create service | Yes | Provider |
| PUT | `/:id` | Update service | Yes | Provider (owner) |
| DELETE | `/:id` | Delete service | Yes | Provider (owner) |

### Service Requests (`/api/requests`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all requests | Yes | Any |
| GET | `/:id` | Get request by ID | Yes | Any |
| GET | `/customer/:customerId` | Get customer requests | Yes | Any |
| GET | `/provider/:providerId` | Get provider requests | Yes | Any |
| GET | `/statuses` | Get all statuses | No | - |
| POST | `/` | Create request | Yes | Customer |
| PUT | `/:id/status` | Update status | Yes | Provider/Customer |
| PUT | `/:id` | Update request | Yes | Any |
| DELETE | `/:id` | Cancel request | Yes | Any |

### Reviews (`/api/reviews`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all reviews | No | - |
| GET | `/:id` | Get review by ID | No | - |
| GET | `/service/:serviceId` | Get service reviews | No | - |
| POST | `/` | Create review | Yes | Customer |
| PUT | `/:id` | Update review | Yes | Customer (owner) |
| DELETE | `/:id` | Delete review | Yes | Customer (owner) |

### Payments (`/api/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all payments | Yes |
| GET | `/:id` | Get payment by ID | Yes |
| POST | `/` | Create payment | Yes |
| PUT | `/:id/status` | Update payment status | Yes |

### Notifications (`/api/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user notifications | Yes |
| GET | `/unread-count` | Get unread count | Yes |
| PUT | `/:id/read` | Mark as read | Yes |
| PUT | `/read-all` | Mark all as read | Yes |
| DELETE | `/:id` | Delete notification | Yes |

### Providers (`/api/providers`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all providers | No | - |
| GET | `/:id` | Get provider by ID | No | - |
| GET | `/:id/certificates` | Get certificates | No | - |
| GET | `/statistics/me` | Get my statistics | Yes | Provider |
| PUT | `/:id` | Update provider | Yes | Provider (owner) |
| POST | `/:id/certificates` | Add certificate | Yes | Provider (owner) |
| DELETE | `/:id/certificates/:certificateId` | Delete certificate | Yes | Provider (owner) |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/dashboard` | Get dashboard stats | Yes | Admin |
| GET | `/stats` | Get system stats | Yes | Admin |
| GET | `/reports` | Get reports | Yes | Admin |
| POST | `/reports` | Generate report | Yes | Admin |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example Authenticated Request

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message here",
  "details": [] // Optional validation errors
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

The backend uses the following main tables:

- **user** - User accounts (all roles)
- **customer** - Customer-specific data
- **provider** - Provider-specific data (ratings, specialization)
- **admin** - Admin-specific data
- **category** - Service categories
- **service** - Services offered by providers
- **servicerequest** - Service requests from customers
- **status** - Request status types
- **review** - Customer reviews
- **payment** - Payment records
- **notification** - User notifications
- **certificate** - Provider certificates
- **serviceimage** - Service images

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

### Testing the API

You can test the API using:
- **Postman** - Import the endpoints and test
- **curl** - Command line testing
- **Thunder Client** (VS Code extension)

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper database credentials
4. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name khadamati-api
```

## Support

For issues or questions, please contact the development team.
