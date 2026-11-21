# FixMyCampus
### *"Report It. Track It. Fix It."*

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-ffca28.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

FixMyCampus is an enterprise-grade smart campus maintenance and problem-reporting platform designed to connect students, faculty, maintenance crews, and college administrators.

---

## 🌟 Key Features

### 1. 🔍 Smart Duplicate Detection
When a student reports an issue, the system automatically checks for existing unresolved complaints in that specific building and room. If detected, an alert banner shows ticket details and an **"Endorse / Me Too (+1)"** button to aggregate student demand instead of creating redundant tickets.

### 2. ⚡ Smart Priority Recommendation Engine
Heuristic evaluation engine that factors in safety hazard keywords (*spark*, *fire*, *flood*, *smoke*), category hazard level, and estimated occupant count to suggest Urgent / High / Medium / Low priority with automated SLA targets.

### 3. 🗺️ Campus Issue Heatmap
An interactive spatial campus radar tracking 8 university facilities with dynamic severity pins:
- 🔴 **Urgent / Hazard**: Immediate attention required (SLA: 12 hrs).
- 🟠 **High Priority**: Significant academic or facility impact (SLA: 24 hrs).
- 🟡 **Medium Priority**: Standard maintenance item (SLA: 48 hrs).
- 🟢 **Nominal / All Resolved**: 100% operational facility.

### 4. 📱 Classroom & Lab QR Dispatch System
Generates printable maintenance placards for any room or laboratory on campus. Scanning launches the mobile report form with the building and room pre-populated for zero-typing reporting.

### 5. ⏱️ Automated SLA Escalation Engine
Monitors elapsed hours against service deadlines. Overdue tickets trigger SLA breach warnings and automated notifications to the Dean and operations administration.

### 6. ⭐ Student Resolution Feedback
Once an issue is resolved, students can provide a 1–5 star rating, confirm whether the problem was actually fixed (Yes/No), and instantly reopen the ticket if the problem persists.

### 7. 📊 Public Transparency Dashboard
An open accountability portal showing total reports, resolution rate, average turnaround hours, and category breakdowns with strict zero-PII protection for student privacy.

### 8. ✨ AI-Ready Smart Report Assistant
On-device NLP heuristic assistant that analyzes draft complaints, improves description technical clarity, suggests categories, and checks for missing location details.

---

## 👥 User Roles & Access Control

FixMyCampus implements strict Role-Based Access Control (RBAC):

1. **Student (Alex Chen)**
   - Report problems with photo evidence or room QR scan.
   - Track ticket progress on a visual timeline.
   - Endorse existing tickets (+1).
   - Rate resolution quality and reopen unresolved issues.
2. **Faculty (Dr. Sarah Sharma)**
   - High-priority laboratory instrument failure reporting.
   - AV and classroom projector downtime tracking.
   - Departmental maintenance monitoring.
3. **Maintenance Staff (Marcus Vance)**
   - Field task queue with location and priority indicators.
   - Update work progress to *In Progress*.
   - Add technical resolution notes and upload after-repair completion photos.
4. **Administrator (Dean Robert Sterling)**
   - Master complaints control table with multi-filters.
   - Department and staff dispatch.
   - Priority overrides and SLA breach tracking.
   - One-click CSV report export.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite, Tailwind CSS (Dark/Light mode)
- **Icons & UI**: Lucide React, Framer Motion, Canvas Confetti
- **Backend Architecture**:
  - **Firebase Cloud Firestore**: Cloud Firestore, Firebase Authentication, and Firebase Storage interfaces.
  - **Persistent LocalStorage Engine**: Seamless fallback when running offline or in demo mode without requiring cloud credentials.
  - **Production Firestore Rules**: Complete security rules protecting student PII and preventing unauthorized role escalation.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/fixmycampus.git

# Navigate into project directory
cd fixmycampus

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will launch on `http://127.0.0.1:5173/`.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🧪 Hackathon Demo Accounts

FixMyCampus includes a persistent **Hackathon Demo Controller** at the bottom of the viewport that enables instant 1-click role switching:

- **Student**: `alex.chen@campus.edu` / `password123`
- **Faculty**: `sarah.sharma@campus.edu` / `password123`
- **Maintenance Staff**: `marcus.vance@facilities.campus.edu` / `password123`
- **Administrator**: `dean.sterling@campus.edu` / `password123`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
