# MGMS - Media Gallery Management System

A full-stack web application for managing and organizing media files. Built with React, Node.js, Express, and MongoDB.

## Features

### User Features
- User authentication (email/password and Google OAuth)
- Email OTP verification for registration and password reset
- Upload and manage images with drag & drop
- Organize images with tags and descriptions
- Share images publicly or keep them private
- Download selected images as ZIP
- Submit contact messages and view admin replies
- Update profile information

### Admin Features
- Manage all users (view, edit roles, activate/deactivate)
- View and manage all uploaded media
- View and reply to contact messages
- Download analytics reports
- System statistics dashboard

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT authentication
- Google OAuth 2.0
- Nodemailer (email OTP)
- Multer (file uploads)
- Cloudinary (optional cloud storage)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MGMS
```

2. Install dependencies:
```bash
npm run setup
```

This installs dependencies for root, backend, and frontend, and creates `.env` files from examples.

Or install manually:
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

3. Set up environment variables:

**Backend** (`backend/.env.example` → `backend/.env`):
- MongoDB connection string
- JWT secrets (32+ characters)
- Google OAuth credentials
- Email/SMTP settings for OTP
- Cloudinary credentials (optional)

**Frontend** (`frontend/.env.example` → `frontend/.env`):
- `VITE_API_BASE_URL` (defaults to `/api` for dev proxy)
- `VITE_GOOGLE_CLIENT_ID`

4. Start the development servers:
```bash
npm run dev
```

This runs both backend (port 5000) and frontend (port 3000).

### Available Scripts

- `npm run dev` - Start both backend and frontend
- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only
- `npm run build` - Build for production

## Project Structure

```
MGMS/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── middlewares/     # Auth, validation, etc.
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── hooks/       # Custom hooks
│       └── utils/       # Utilities
├── .gitignore
├── package.json
└── README.md
```

## Google OAuth Setup

When setting up Google OAuth, make sure to add authorized origins in Google Cloud Console:
- `http://localhost:3000`
- `http://localhost:3001` (if Vite uses port 3001)

See `GOOGLE_OAUTH_SETUP.md` for detailed instructions.

## API Overview

All API endpoints are prefixed with `/api`.

**Authentication:**
- `POST /api/auth/register` - Register (requires OTP)
- `POST /api/auth/verify-email` - Verify OTP
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/google` - Google OAuth redirect
- `POST /api/auth/refresh` - Refresh JWT token

**Media:**
- `GET /api/media` - Get images (supports filters: search, tags, isShared, personal)
- `POST /api/media/upload` - Upload image
- `GET /api/media/:id` - Get image details
- `PUT /api/media/:id` - Update image
- `DELETE /api/media/:id` - Delete image
- `POST /api/media/download-zip` - Download images as ZIP

**Contact:**
- `POST /api/contact` - Submit contact message
- `GET /api/contact/my-messages` - Get user's messages
- `PUT /api/contact/:id` - Update message (owner only)
- `DELETE /api/contact/:id` - Delete message (owner only)

**Admin:**
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user
- `PATCH /api/admin/users/:id/deactivate` - Deactivate user
- `GET /api/admin/contacts` - Get all contact messages
- `POST /api/admin/contacts/:id/reply` - Reply to message
- `GET /api/admin/media` - Get all media
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/reports/analytics.txt` - Download analytics report

Most endpoints require authentication (JWT token). Admin endpoints require admin role.

## Security

- Passwords are hashed with bcrypt
- JWT tokens expire after 1 hour (refresh tokens: 7 days)
- Protected routes require authentication
- Admin routes require admin role
- File uploads validated (JPG/PNG only, max 5MB)
- Input validation on all endpoints
- CORS configured for specific frontend URL

## Deployment

**Backend:**
- Set environment variables on hosting platform
- Set root directory to `backend`
- Start command: `npm start`

**Frontend:**
- Build: `npm run build`
- Output directory: `dist`
- Set environment variables in hosting dashboard
- Update `FRONTEND_URL` in backend `.env` after deployment

## License

MIT

## Author

Created by **Dehan Nimna Sandadiya**

- GitHub: [@DehanNimnaSandadiya](https://github.com/DehanNimnaSandadiya)
- LinkedIn: [dehannimnasandadiya](https://www.linkedin.com/in/dehannimnasandadiya/)
