# Khadamati - Full-Stack Home Services Platform

A complete full-stack web application for managing home services, connecting customers with service providers.

## 🏗️ Project Structure

```
KHDFIX/
├── client/              # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/             # Node.js/Express API
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── KHADAMATI.sql        # Database schema
├── package.json         # Root package.json
└── README.md
```

## ✨ Features

### Frontend (React)
- 🌐 Multi-language support (Arabic & English)
- 🌙 Dark/Light mode
- 👥 Role-based dashboards (Admin, Provider, Customer)
- 📱 Responsive design with Tailwind CSS
- 🔍 Advanced search and filtering
- 💳 Payment integration
- ⭐ Review and rating system
- 🔔 Real-time notifications

### Backend (Node.js/Express)
- 🔐 JWT authentication & authorization
- 👤 Role-based access control
- 📊 RESTful API architecture
- ✅ Input validation
- 🔒 Password hashing with bcrypt
- 💾 MySQL database integration
- 📈 Admin dashboard with statistics
- 🔔 Notification system

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- XAMPP (for MySQL database)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd KHDFIX
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for root, client, and backend.

3. **Setup Database**
   - Start XAMPP (Apache & MySQL)
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import `KHADAMATI.sql` file
   - Verify the `khadamati` database is created

4. **Configure Backend**
   - Navigate to `backend/` folder
   - Copy `.env.example` to `.env`
   - Update database credentials if needed (default XAMPP settings are pre-configured)

5. **Start the Application**
   
   **Option 1: Run both client and server together**
   ```bash
   npm run dev
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📁 Detailed Setup

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=khadamati

JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

Start backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Start frontend:
```bash
npm start
```

## 🔑 Default Users

After importing the SQL file, you can use these test accounts:

**Customer:**
- Email: john@example.com
- Password: (set your own via registration)

**Provider:**
- Email: ahmed@service.com
- Password: (set your own via registration)

## 📚 API Documentation

Full API documentation is available in `backend/README.md`

### Main Endpoints

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Categories**: `/api/categories/*`
- **Services**: `/api/services/*`
- **Requests**: `/api/requests/*`
- **Reviews**: `/api/reviews/*`
- **Payments**: `/api/payments/*`
- **Notifications**: `/api/notifications/*`
- **Providers**: `/api/providers/*`
- **Admin**: `/api/admin/*`

## 🛠️ Technologies Used

### Frontend
- React 18.2.0
- React Router 6.26.0
- Tailwind CSS 3.4.1
- React i18next (Multi-language)
- React Icons
- Recharts (Dashboard charts)

### Backend
- Node.js
- Express.js 4.18.2
- MySQL2 3.6.5
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- CORS

## 📊 Database Schema

The application uses 14 main tables:
- `user` - User accounts
- `customer` - Customer profiles
- `provider` - Provider profiles
- `admin` - Admin accounts
- `category` - Service categories
- `service` - Available services
- `servicerequest` - Service bookings
- `status` - Request statuses
- `review` - Customer reviews
- `payment` - Payment records
- `notification` - User notifications
- `certificate` - Provider certificates
- `serviceimage` - Service images
- `reports` - Admin reports

## 🔐 Authentication Flow

1. User registers via `/api/auth/register`
2. Backend creates user and role-specific record (customer/provider)
3. User logs in via `/api/auth/login`
4. Backend returns JWT token
5. Frontend stores token and includes it in subsequent requests
6. Backend validates token on protected routes

## 🎨 Frontend Features

- **Multi-language**: Switch between Arabic and English
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works on desktop, tablet, and mobile
- **Role-based Dashboards**:
  - Admin: Manage users, services, categories, view reports
  - Provider: Manage services, view requests, track earnings
  - Customer: Browse services, make requests, write reviews

## 🔧 Development

### Running Tests
```bash
# Frontend tests
cd client
npm test

# Backend tests (to be implemented)
cd backend
npm test
```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
Set `NODE_ENV=production` in `.env` and use a process manager like PM2.

## 📝 Scripts

### Root Level
- `npm run client` - Start React frontend
- `npm run server` - Start Express backend
- `npm run dev` - Run both concurrently
- `npm run install-all` - Install all dependencies

### Backend
- `npm start` - Start server (production)
- `npm run dev` - Start with nodemon (development)

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Database Connection Issues
- Ensure XAMPP MySQL is running
- Check database credentials in `backend/.env`
- Verify `khadamati` database exists in phpMyAdmin

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Set `PORT=3001` in `client/.env` (create if needed)

### CORS Issues
- Ensure backend CORS is configured correctly
- Check proxy setting in `client/package.json`

## 📞 Support

For issues or questions, please open an issue on the repository.


## Recent Updates & Fixes

### ✅ 1. Fixed Sidebar Duplication
- **Issue**: Sidebar was appearing twice in dashboard pages
- **Solution**: 
  - Each role (Admin, Provider, Customer) now has its own dedicated layout component
  - Layouts properly wrap dashboard pages using React Router's `<Outlet />` pattern
  - No duplicate rendering of sidebars

### ✅ 2. Search Section Improvements
- **Removed**: Google Map component completely
- **Added**: 
  - Dropdown list for location selection (static locations for Baalbek-Hermel region)
  - Dropdown list for service categories
  - Click-to-select functionality for both dropdowns
  - Auto-filtering based on user input
  - Proper RTL/LTR support for dropdowns

### ✅ 3. Full Multi-Language Support (Arabic + English)
- **Implementation**:
  - Complete i18n integration using `react-i18next`
  - Comprehensive translation files for both Arabic and English
  - All UI elements translated (navbar, sidebar, footer, forms, buttons, notifications, tables)
  - Language switcher in navbar (AR/EN buttons)
  - Automatic RTL/LTR direction switching
  - Translations cover:
    - Common UI elements
    - Authentication pages
    - Dashboard pages (Admin, Provider, Customer)
    - Service pages
    - Footer and navigation
    - Error and success messages
    - Payment pages

### ✅ 4. Currency Selection
- **Moved**: Currency switcher removed from navbar
- **Location**: Currency selection should be implemented in payment pages only
- **Storage**: Currency preference saved in localStorage
- **Context**: CurrencyContext still available for use in payment components

### ✅ 5. Dark / Light Mode
- **Status**: Fully functional
- **Features**:
  - Toggle button in navbar (Sun/Moon icons)
  - Theme saved in localStorage
  - Applied globally using Tailwind's dark mode (class strategy)
  - All components support dark mode variants

### ✅ 6. Map Removal
- **Removed**:
  - MapComponent from Home page
  - Leaflet CSS import
  - Map section from homepage
  - All map-related dependencies can be uninstalled if desired

### ✅ 7. Global Code Cleanup
- **Cleaned**:
  - Removed unused imports (MapComponent, currency from Navbar, leaflet CSS)
  - Removed unused functions (handleShowServicesNearMe)
  - Updated all layouts with proper i18n support
  - Fixed RTL/LTR styles for both languages
  - Unified font sizes and spacing across dashboards
  - Consistent UI for all roles

## Project Structure

```
src/
├── components/
│   ├── Footer/          # Translated footer component
│   ├── Navbar/          # Navbar with language & theme toggles
│   ├── SearchBar/       # Enhanced search with dropdowns
│   └── ...
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx # Dark/Light mode management
│   └── CurrencyContext.jsx # Currency management
├── i18n/
│   ├── config.js        # i18n configuration
│   └── locales/
│       ├── en.json      # English translations
│       └── ar.json      # Arabic translations
├── layouts/
│   ├── AdminLayout.jsx    # Admin dashboard layout
│   ├── ProviderLayout.jsx # Provider dashboard layout
│   └── CustomerLayout.jsx # Customer dashboard layout
└── pages/
    ├── admin/           # Admin pages
    ├── provider/        # Provider pages
    ├── customer/        # Customer pages
    └── ...
```

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Features

### Multi-Language Support
- Switch between Arabic and English using the language toggle in the navbar
- All content automatically translates
- RTL layout for Arabic, LTR for English
- Language preference saved in localStorage

### Dark Mode
- Toggle between dark and light themes using the theme button in navbar
- Theme preference saved in localStorage
- All components have dark mode variants

### Role-Based Dashboards
- **Admin Dashboard**: Manage users, providers, services, categories, requests, payments
- **Provider Dashboard**: Manage services, view requests, track earnings, view reviews
- **Customer Dashboard**: View requests, manage profile, check notifications

### Search Functionality
- Search for services by name
- Filter by location (Baalbek-Hermel region)
- Dropdown suggestions for both services and locations
- Real-time filtering as you type

## Technologies Used

- **React** 18.2.0
- **React Router** 6.26.0
- **React i18next** 14.0.5 (Multi-language)
- **Tailwind CSS** 3.4.1 (Styling + Dark Mode)
- **React Icons** 5.5.0
- **Recharts** 3.5.1 (Charts for dashboards)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Default language is Arabic (AR)
- Default theme follows system preference, then falls back to saved preference
- All mock data is stored in localStorage
- Currency conversion rate: 1 USD = 15,000 LBP (configurable)

## Future Enhancements

- Add payment page with currency selection
- Implement real-time notifications
- Add more location options
- Integrate with backend API
- Add image upload functionality
- Implement real-time chat between customers and providers
