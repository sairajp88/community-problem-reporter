# 🗺️ Community Problem Reporter

### Sprint 1 — Map & Zones Foundation

This project is a **map-based civic issue reporting platform**.
Sprint 1 focuses on **project setup and interactive map foundations** using **OpenLayers**.

---

## ✅ Sprint 1 Features

* Project setup with **React (Vite)** and **Node.js (Express)**
* Interactive **OpenLayers** map (non-satellite)
* Map centered on **Mumbai**
* Static **GeoJSON zone polygons**
* Zones displayed with:

  * Distinct colors
  * Zone name labels
* **Hover interaction**

  * Zone highlights on mouse hover
  * Pointer cursor on hover
* **Click interaction**

  * Clicking a zone logs its name in console
* Clean, scalable folder structure
* Backend health API (`/api/health`)
* Versioned and pushed to **GitHub**

---

## 🧱 Tech Stack

**Frontend**

* React (Vite)
* OpenLayers
* JavaScript

**Backend**

* Node.js
* Express.js

---

## 📂 Project Structure (Simplified)

```
frontend/
 ├─ src/
 │  ├─ components/Map/
 │  ├─ pages/
 │  └─ App.jsx
 └─ public/zones/sample-zones.geojson

backend/
 └─ src/
```

---

## ▶️ Running the Project

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

---

## 🚧 What’s Next (Sprint 2)

* MongoDB integration
* Zone hierarchy (City → Sector → Area)
* Admin zone management
* Turf.js spatial logic

---

## 🏁 Status

✅ **Sprint 1 completed and stable**
This repository represents a **working foundation** for future sprints.

---

If you want, I can also:

* Make this README more technical
* Add screenshots section
* Write Sprint 2 README template
