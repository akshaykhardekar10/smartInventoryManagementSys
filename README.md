
# 📦 **SmartLIMS** – Full-Stack Inventory Management System

A powerful inventory management solution for electronics labs, built with the **MERN stack** (MongoDB, Express.js, React, Node.js).

![Dashboard Preview](images\Dashboard - Copy.png) <!-- Replace with your actual image path -->

---

## 🚀 Quick Setup

### ⚙️ Prerequisites

- 🟢 Node.js (v16 or higher)
- 🍃 MongoDB (running on `localhost:27017`)
- 📦 npm or yarn

---

### 🗄️ 1. Database Setup

SmartLIMS uses MongoDB at:

```
mongodb://localhost:27017/smartlims
```

> 🧠 The database will be auto-created on first run.

---

### 🖥️ 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

📍 Server: `http://localhost:5000`

---

### 💻 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

🌐 Frontend: `http://localhost:5173`

---

### 👤 4. Create Admin User

```bash
cd server
node scripts/setupAdmin.js
```

🧑 **Admin Credentials**:

- Email: `admin@smartlims.com`
- Password: `admin123`

---

## 🔧 Manual Setup Steps

### 1️⃣ Start MongoDB

```bash
mongod
```

### 2️⃣ Create Admin User (if not already done)

```bash
cd server
node scripts/setupAdmin.js
```

### 3️⃣ Test the App

- Visit: `http://localhost:5173`
- Login with the admin credentials
- Start managing your inventory 🎉

---

## 🗂️ Project Structure

```
A111/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # API integrations
│   │   ├── contexts/       # React Context API
│   │   └── App.jsx         # Root component
│   └── package.json
└── server/                 # Node.js Backend
    ├── models/             # Mongoose models
    ├── routes/             # Express routes
    ├── middlewares/        # Auth middleware
    ├── utils/              # Helper utilities
    ├── scripts/            # Setup scripts
    └── server.js           # Entry point
```

---

## ✨ Features

### 🔐 Authentication & Roles

- JWT-based auth
- Admin / Technician / Researcher roles
- Role-based route protection

### 📊 Dashboard

- Monthly stock charts
- Low stock alerts
- Inactive stock tracking (>3 months)
- Inventory value calculation

### 🧰 Inventory Management

- Add, edit, delete components (Admin only)
- Filter by part number, category, or location
- QR code generation for components
- Search functionality

### 🔁 Stock Movement

- Log inward/outward inventory movements
- Track reasons and quantities
- Auto-adjust inventory levels

---

## 👤 Default Users (Example)

You can add these manually in MongoDB:

```json
{
  "name": "Technician User",
  "email": "tech@smartlims.com",
  "password": "tech123",
  "role": "technician"
}
```

```json
{
  "name": "Researcher User",
  "email": "researcher@smartlims.com",
  "password": "researcher123",
  "role": "researcher"
}
```

---

## 🧪 API Endpoints

### 🔐 Auth

| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/login`    | User login         |
| GET    | `/api/auth/me`       | Current user info  |

### 📦 Components

| Method | Endpoint                     | Description           |
|--------|------------------------------|-----------------------|
| GET    | `/api/components`            | List all components   |
| POST   | `/api/components`            | Create (Admin only)   |
| PUT    | `/api/components/:id`        | Update (Admin only)   |
| DELETE | `/api/components/:id`        | Delete (Admin only)   |

### 🔄 Stock Logs

| Method | Endpoint               | Description      |
|--------|------------------------|------------------|
| GET    | `/api/stocklogs`       | List stock logs  |
| POST   | `/api/stocklogs`       | Add stock log    |

### 📊 Dashboard

| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api/dashboard/stats`    | Dashboard stats      |
| GET    | `/api/dashboard/charts`   | Chart data           |

---

## 💻 Tech Stack

### 🌐 Frontend

- ⚛️ React 18 + Vite
- 📍 React Router
- 💅 Tailwind CSS
- 📊 Chart.js
- 📷 qrcode.react
- 📡 Axios

### 🔧 Backend

- 🟢 Node.js + Express
- 🍃 MongoDB + Mongoose
- 🔐 JWT Auth
- 🔑 bcryptjs
- 📷 qrcode package (QR generation)

---

## 🚀 Deployment

### 📡 Backend

- Set environment variables
- Use PM2 or Docker
- Optional: Use MongoDB Atlas

### 🌍 Frontend

```bash
npm run build
```

Then deploy via:

- [Vercel](https://vercel.com)
- [Netlify](https://www.netlify.com)
- Any static hosting provider

---

## 🧑‍💻 UI Screenshots

> Replace these placeholders with actual screenshots:

- ![Login](images/login-page.png)
- ![Dashboard](images/dashboard.png)
- ![Inventory](images/inventory-table.png)
- ![QR Code](images/qr-code.png)

---

## 🆘 Support

If you encounter issues:

1. ✅ Check browser console
2. 🪵 Inspect backend logs
3. 🧪 Confirm MongoDB is running
4. 🔁 Re-run admin setup
5. 📦 Ensure all dependencies are installed

---

## 🏁 You're Ready!

1. Start the backend
2. Run the frontend
3. Create the admin user
4. 🚀 Begin managing your lab inventory!
