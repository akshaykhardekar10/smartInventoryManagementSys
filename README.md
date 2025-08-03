# SmartLIMS - Full-Stack Inventory Management System

A complete inventory management system for electronics labs using the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Quick Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### 1. Database Setup

Your MongoDB is already configured correctly at `mongodb://localhost:27017/smartlims`. The database will be created automatically when you first run the application.

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Create Admin User

Run this command from the server directory to create the initial admin user:

```bash
cd server
node scripts/setupAdmin.js
```

This will create an admin user with:
- Email: `admin@smartlims.com`
- Password: `admin123`

## 🔧 Manual Steps Required

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows, start MongoDB service
# Or if you have MongoDB installed locally, run:
mongod
```

### 2. Create Admin User
Run the setup script:
```bash
cd server
node scripts/setupAdmin.js
```

### 3. Test the Application
1. Open `http://localhost:5173` in your browser
2. Login with the admin credentials
3. Start adding components and logging movements

## 📁 Project Structure

```
A111/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   └── App.jsx        # Main app component
│   └── package.json
└── server/                # Node.js Backend
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── middlewares/       # Auth middleware
    ├── utils/             # Utility functions
    ├── scripts/           # Setup scripts
    └── server.js          # Main server file
```

## 🎯 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Technician, Researcher)
- Protected routes

### Dashboard
- Monthly stock movement charts
- Low stock alerts
- Old stock tracking (>3 months)
- Total inventory value

### Inventory Management
- Add/Edit/Delete components (Admin only)
- Filter by category, part number, location
- Search functionality
- QR code generation for each component

### Stock Movement
- Log inward/outward movements
- Track reasons and quantities
- Automatic stock updates

## 🔐 Default Users

After running the setup script, you can create additional users manually in MongoDB:

```javascript
// Example users you can create
{
  "name": "Technician User",
  "email": "tech@smartlims.com",
  "password": "tech123",
  "role": "technician"
}

{
  "name": "Researcher User", 
  "email": "researcher@smartlims.com",
  "password": "researcher123",
  "role": "researcher"
}
```

## 🛠️ Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on localhost:27017
- Check if the MongoDB service is started
- Verify the connection string in `server/config.env`

### Port Issues
- Backend runs on port 5000
- Frontend runs on port 5173
- Make sure these ports are available

### Authentication Issues
- Clear browser localStorage if you encounter token issues
- Check the browser console for API errors
- Verify the JWT_SECRET in config.env

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Components
- `GET /api/components` - Get all components (with filters)
- `POST /api/components` - Create component (Admin only)
- `PUT /api/components/:id` - Update component (Admin only)
- `DELETE /api/components/:id` - Delete component (Admin only)

### Stock Logs
- `GET /api/stocklogs` - Get all stock logs
- `POST /api/stocklogs` - Create stock log

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data

## 🎨 Technologies Used

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Chart.js for analytics
- qrcode.react for QR generation
- Axios for API calls

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- qrcode for QR generation

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Set up MongoDB Atlas for cloud database

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs for backend errors
3. Verify MongoDB connection
4. Ensure all dependencies are installed

The application is now ready to use! Start with the backend, then frontend, and create the admin user to begin managing your inventory. 