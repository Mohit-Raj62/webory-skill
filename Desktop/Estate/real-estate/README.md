# Real Estate Application

A modern real estate application built with React, Node.js, Express, and MongoDB.

## Features

- Browse property listings
- View property details
- Contact property owners
- User authentication
- Admin dashboard for property management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd real-estate
```

2. Install dependencies for both frontend and backend:
```
cd frontend
npm install
cd ../backend
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/real-estate
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

## Running the Application

### Option 1: Start both servers with a single command

Run the PowerShell script:
```
.\start-all.ps1
```

### Option 2: Start servers separately

1. Start the backend server:
```
cd backend
npm run dev
```

2. Start the frontend server:
```
cd frontend
npm run dev
```

## Accessing the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get a specific property
- `POST /api/properties` - Create a new property (requires authentication)
- `PUT /api/properties/:id` - Update a property (requires authentication)
- `DELETE /api/properties/:id` - Delete a property (requires authentication)
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

## Technologies Used

- Frontend: React, Material-UI, Swiper, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT, bcrypt
- File Upload: Multer, Cloudinary
