# Installation Guide

## Prerequisites

- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/cashbook
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

4. Run database migrations:
```bash
node scripts/seed-admin.js
```

5. Start the server:
```bash
npm start
```

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Testing

1. Login with default admin account:
   - Email: admin@stl.gov.in
   - Password: Admin123

2. Create new users and approve them in User Management