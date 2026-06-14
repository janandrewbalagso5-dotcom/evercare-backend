# EverCare Backend API

Express.js backend for EverCare Medical Center. Works with or without Firebase — falls back to in-memory mock data automatically.

---

## Project Structure

```
evercare-backend/
├── src/
│   ├── index.js              # Express app entry point
│   ├── firebase/
│   │   ├── admin.js          # Firebase Admin SDK init
│   │   └── mockData.js       # In-memory mock data (seed data)
│   └── routes/
│       ├── users.js          # GET/POST/PATCH /api/users
│       ├── doctors.js        # GET /api/doctors, PATCH availability
│       ├── appointments.js   # GET/POST/PATCH /api/appointments
│       ├── transactions.js   # GET/POST /api/transactions
│       └── system.js         # Logs, settings, reset, backup
├── firebase.js               # ⬅ Drop this into your frontend src/services/
├── .env.example
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/users?email=xxx` | Get user by email |
| GET | `/api/users/patients` | Get all patients |
| POST | `/api/users` | Create user |
| PATCH | `/api/users/:uid` | Update user |
| GET | `/api/doctors` | Get all doctors |
| PATCH | `/api/doctors/:id/availability` | Update doctor availability |
| GET | `/api/appointments` | Get all appointments |
| POST | `/api/appointments` | Book appointment |
| PATCH | `/api/appointments/:id` | Update appointment |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add transaction |
| GET | `/api/system/logs` | Get system logs |
| POST | `/api/system/logs` | Write log entry |
| GET | `/api/system/settings` | Get settings |
| PUT | `/api/system/settings` | Update settings |
| POST | `/api/system/reset` | Reset mock database |
| GET | `/api/system/backup` | Export database backup |

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Run in mock mode (no Firebase needed)
npm run dev

# API will be live at http://localhost:3000
```

---

## Connect Frontend to Backend

1. Copy `firebase.js` from this folder into your frontend at:
   `EverCare/src/services/firebase.js` (replace the existing one)

2. Add this to your frontend `.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```

3. For production, set `VITE_API_URL` to your deployed Render URL.

---

## Deploy to Render (Free)

1. Push `evercare-backend/` to a GitHub repository
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo
4. Set these:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add from your `.env`
5. Click Deploy — Render gives you a public URL like:
   `https://evercare-backend.onrender.com`
6. Update your frontend `VITE_API_URL` to that URL, then deploy frontend to Vercel

---

## Deploy Frontend to Vercel

```bash
# In your EverCare frontend folder
npm run build

# Then drag the dist/ folder to vercel.com
# OR connect your GitHub repo to Vercel
```

Set this environment variable in Vercel:
```
VITE_API_URL=https://your-evercare-backend.onrender.com
```

---

## Adding Firebase (Optional)

If you want real persistent data (not just in-memory mock):

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project → Project Settings → Service Accounts
3. Click **Generate new private key** → download the JSON
4. Fill in your `.env` with values from that JSON:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@...
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```
5. Restart the server — it will automatically use Firestore instead of mock data

---

## What Your Teacher Will See

- **Frontend URL** (Vercel): The full EverCare UI
- **Backend URL** (Render): A live REST API at `/` showing health check
- **API routes**: Clearly separated backend handling all data logic
- **Two deployments**: Proves frontend/backend separation ✅
