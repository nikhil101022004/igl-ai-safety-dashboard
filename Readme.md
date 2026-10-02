# 🏭 IGL Industrial AI Safety Intelligence System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-111111?style=for-the-badge&logo=ultralytics&logoColor=white)](https://www.ultralytics.com/)

A full-stack, real-time AI-powered Environment, Health, and Safety (EHS) monitoring dashboard built for **India Glycols Limited**. This system uses computer vision and live data streams to detect workplace hazards, monitor restricted zones, and ensure personnel safety in industrial environments.

---

## 📌 Project Context & Contributions

*Note: This project was built upon an initial base repository that provided the fundamental database and basic UI structure. The following advanced features, integrations, and UI overhauls were developed and integrated from scratch to transform it into a production-ready application:*

- 🤖 **Integrated Real-Time YOLOv8 AI:** Connected a Python backend running Ultralytics YOLOv8 to process live webcam frames and draw real-time bounding boxes for object detection.
- 📊 **Interactive Analytics & PDF Export:** Upgraded the analytics dashboard using `Recharts` and implemented a client-side PDF report generator using `jspdf` and `html2canvas`.
- 🌡️ **Live Environmental Sensors:** Engineered a real-time updating UI component simulating live IoT sensor data (temperature, gas levels).
- 🖼️ **Dynamic Evidence Handling:** Upgraded the alert modal to display simulated evidence photos for a more professional, production-ready UI.
- 🔐 **Secure Login Flow:** Implemented a role-based authentication UI for the EHS Administrator.

---

## ✨ Key Features

- 🔐 **Secure Authentication:** Role-based login for EHS Administrators.
- 📊 **Real-Time Command Center:** Live KPIs for active alerts, camera status, and AI health.
-  **Dual AI Engine:** Supports both frontend TensorFlow.js (fast) and backend YOLOv8 (accurate) object detection.
- 📹 **Live Webcam Integration:** Connects to local webcams or RTSP streams for live monitoring.
- 📈 **Interactive Analytics:** Visual charts (Bar & Pie) breaking down alert types and severity levels.
- 📄 **PDF Reporting:** One-click generation and download of safety audit reports.
- 🌡️ **Environmental Monitoring:** Live sensor data simulation for temperature and gas levels.
-  **Complete Alert Workflow:** Lifecycle management from Detection  Acknowledgment ➔ Resolution.

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Tools & Libraries |
| :--- | :--- | :--- | :--- |
| React.js | Python (FastAPI) | SQLite | Vite, Tailwind CSS |
| Recharts | Uvicorn | | Lucide Icons, OpenCV |
| JSPDF / HTML2Canvas | Ultralytics (YOLOv8) | | TensorFlow.js |

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)

### 1. Backend Setup
Open your terminal and run the following commands to set up the Python backend:

```bash
# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies (Includes FastAPI, OpenCV, and YOLOv8)
pip install fastapi uvicorn requests numpy opencv-python ultralytics

# Initialize database and add dummy data
python database.py
python seed_data.py

# Start the backend server
python main.py

#Frontend Setup


# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
npm install recharts jspdf html2canvas

# Start the development server
npm run dev

# AI Simulator (Optional)

cd backend
venv\Scripts\activate
python simulate_ai.py


Use the following credentials to log in:
Username: admin
Password: admin123

IGL/
├── backend/
│   ├── main.py            # FastAPI server, API routes, and YOLOv8 endpoint
│   ├── database.py        # SQLite database initialization
│   ├── ai_engine.py       # Frame quality and spatial logic
│   ├── real_ai_test.py    # Standalone YOLOv8 webcam test script
│   ├── seed_data.py       # Script to populate dummy data
│   ── simulate_ai.py     # Script to simulate live AI alerts
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components (Login, Modals, Navbar)
│   │   ├── views/         # Main page views (Dashboard, Analytics, Live Monitoring)
│   │   ├── context/       # React Context for global state management
│   │   └── services/      # API service calls and TensorFlow processor
│   └── package.json
└── README.md