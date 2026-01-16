# Car Dealership - Full Stack Application

A production-ready car dealership application with React frontend and Node.js/Express backend with MongoDB.

## Features

- 🚗 **Vehicle Management**: Browse, search, and filter vehicles
- 📧 **Enquiry System**: Customer enquiry management with status tracking
- ⭐ **Testimonials**: Customer testimonials display
- ⚙️ **Admin Panel**: Complete admin dashboard for managing vehicles, enquiries, and settings
- 🔐 **Authentication**: Secure admin authentication with JWT
- 📱 **Responsive Design**: Modern, mobile-first UI
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- TanStack Query (React Query)
- Tailwind CSS
- shadcn/ui components

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Express Validator
- Helmet (Security)
- Rate Limiting

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/car-dealership

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

For production, use MongoDB Atlas or another cloud MongoDB service:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car-dealership
```

### 3. Seed the Database

Populate MongoDB with initial data:

```bash
npm run seed
```

This will create:
- Sample vehicles
- Sample testimonials
- Default website settings
- Admin user (email: `admin@autoelite.com`, password: `admin123`)

### 4. Start the Development Servers

**Terminal 1 - Backend API:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Production Build

### Build Backend

```bash
npm run build:api
npm run start:api
```

### Build Frontend

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Endpoints

### Public Endpoints

- `GET /api/vehicles` - Get all vehicles (with filters)
- `GET /api/vehicles/:id` - Get single vehicle
- `GET /api/testimonials` - Get all testimonials
- `GET /api/settings` - Get website settings
- `POST /api/enquiries` - Create enquiry

### Admin Endpoints (Requires Authentication)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin
- `GET /api/admin/stats` - Get dashboard statistics
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle
- `GET /api/enquiries` - Get all enquiries
- `PUT /api/enquiries/:id` - Update enquiry
- `POST /api/enquiries/:id/notes` - Add note to enquiry
- `PUT /api/settings` - Update settings
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

## Creating Admin Users

To create additional admin users:

```bash
npm run create-admin
```

Follow the prompts to enter email, password, and name.

## Project Structure

```
car/
├── api/                    # Backend API
│   ├── config/             # Database configuration
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth, error handling
│   ├── scripts/            # Seed scripts
│   └── index.ts            # Express server
├── app/                    # React frontend
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   └── main.tsx            # Entry point
├── components/             # Reusable components
├── lib/                    # Utilities and API client
└── data/                   # Sample data (for seeding)
```

## Environment Variables

### Development
- `MONGODB_URI`: Local MongoDB connection string
- `PORT`: Backend server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS
- `JWT_SECRET`: Secret key for JWT tokens

### Production
- Set `NODE_ENV=production`
- Use secure MongoDB connection (Atlas)
- Use strong `JWT_SECRET`
- Configure proper CORS origins
- Set up environment variables on your hosting platform

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Helmet.js for security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS configuration
- ✅ Environment variable protection

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
