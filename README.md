# 🏙️ Community Problem Reporter

**A map-driven civic issue reporting platform**

Community Problem Reporter is a **location-aware web application** that allows residents to report local issues directly on a map, while enabling administrators and zone managers to monitor, manage, and resolve them efficiently.

Built with **MERN Stack + OpenLayers**, the system emphasizes **spatial accuracy, role-based access, and real-time collaboration**.

---

## 🚀 Key Features (Current MVP)

### 🗺️ Interactive Map (Core Feature)

* OpenLayers-powered map
* Zone boundaries rendered as polygons
* Issues displayed as map markers
* Emergency issues highlighted distinctly
* Smooth zoom & focus on issue selection

---

### 📍 Issue Reporting (Resident Flow)

* Drop a pin anywhere on the map
* Preview pin before creating an issue
* Create issues with:

  * Title & description
  * Category
  * Severity (Normal / Emergency)
* Issue is **automatically assigned to the correct zone** using spatial analysis

---

### 🧑‍🤝‍🧑 Role-Based System

| Role             | Capabilities                               |
| ---------------- | ------------------------------------------ |
| **Resident**     | Report issues, view own issues, comment    |
| **Zone Manager** | View & manage issues in assigned zones     |
| **Admin**        | View all issues, emergencies, assign zones |

Role enforcement is handled **server-side** (JWT + middleware).

---

### 🧠 Zone-Aware Intelligence (Foundational)

* Each issue belongs to exactly one zone
* Zones support hierarchy (city → sector → area → society)
* Zone managers only see issues from their assigned zones
* Foundation laid for future zone analytics

---

### 💬 Real-Time Comments

* Issue-level discussion thread
* Live updates via Socket.IO
* No page refresh required

---

### ⚠️ Emergency Handling

* Emergency issues visually highlighted
* Separate emergency list in Admin sidebar
* Immediate visibility across roles

---

### 📊 Admin Dashboard

* Total issue count
* Open vs resolved issues
* Emergency issue overview
* Issue status management (open / in-progress / resolved)

---

## 🧱 Tech Stack

### Frontend

* **React (Vite)**
* **OpenLayers** (maps & geospatial rendering)
* Axios
* Socket.IO Client

### Backend

* **Node.js + Express**
* **MongoDB + Mongoose**
* **Turf.js** (geospatial computations)
* Socket.IO
* JWT Authentication

---

## 🗂️ Project Structure

```
community-problem-reporter/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── socket.js
│   └── vite.config.js
```

---

## 🔐 Authentication & Security

* JWT-based authentication
* Role-based authorization middleware
* Protected API routes
* Secure password hashing (bcrypt)

---

## 🧪 Current Status

✅ Core functionality complete
✅ Stable backend architecture
✅ Fully working role-based flows

🟡 UI polish in progress
🟡 Zone intelligence & analytics pending

This project is **beyond demo stage** and actively evolving.

---

## 🔜 Planned Enhancements

* Zone intelligence dashboards
* Heatmaps & analytics
* Improved UI/UX design
* Image uploads for issues
* Resolution time metrics
* Better mobile responsiveness

---

## 🛠️ Setup (Local)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Create `.env` in backend with:

```
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
CLOUDINARY_KEYS=...
```

---

## 📌 Philosophy

> Real problems deserve spatial context.
> Good governance starts with visibility.



