# 🐾 AkohFlow (FocusPaws) — Cross-Platform Productivity & Gamified Task Engine

A production-ready, cross-platform productivity and task companion application engineered for **Android, Web, and iOS** featuring a **\$0/month serverless architecture**, gamified critter companions, and integrated **Google AdMob & AdSense monetization**.

[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.5-119EFF?style=flat-square&logo=capacitor&logoColor=white)](https://capacitorjs.com)
[![Python Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Google AdMob](https://img.shields.io/badge/Google_AdMob-Ready-EA4335?style=flat-square&logo=google&logoColor=white)](https://admob.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## The Problem & The Build

The primary issue with standard task managers is the drop-off cliff: over 70% of users abandon clean to-do lists within 72 hours due to lack of behavioral feedback. 

**AkohFlow (FocusPaws)** solves retention through gamified critter companions combined with a responsive, offline-tolerant cross-platform architecture. Completing real-world tasks fuels daily streak meters, energizes companions, and unlocks avatar progression.

### Core Capabilities
- 🐶 **8 Interactive Cartoon Companions**: Adopt and switch between Buddy the Dog, Milo the Cat, Woolly the Sheep, Bao the Panda, Rusty the Fox, Hoppy the Bunny, Barnaby the Bear, and Leo the Lion.
- 🏆 **Paw Streak Engine**: Stateful task completion tracking with daily streak counters and visual energy metrics.
- 👤 **Decoupled Identity System**: Real-time username and avatar management with stateless JWT authorization.
- 📱 **Native Mobile Compilation**: Single-codebase architecture compiled to native Android APKs via Capacitor 8 with hardware back-button handling and Android splash screens.
- 🎁 **Monetization Pipeline**: Integrated Google AdMob banner ads and opt-in rewarded video ads ("Pet Treats") for non-intrusive revenue generation.

---

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Cross-Platform UI                    │
│   (React 19, Tailwind CSS v4, Lucide, Vite)            │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
       Capacitor 8 Bridge        Axios + JWT Interceptors
                │                        │
┌───────────────▼───────────────┐ ┌──────▼───────────────┐
│       Native Android          │ │   Python Flask API   │
│  (Gradle 8.9, AdMob SDK)      │ │   (Blueprints, Auth) │
└───────────────────────────────┘ └──────┬───────────────┘
                                         │ SQLAlchemy
                                ┌────────▼───────────────┐
                                │  Supabase PostgreSQL   │
                                │ (SQLite dev fallback)  │
                                └────────────────────────┘
```

### Directory Structure

```plaintext
AkohFlow/
├── backend/                       # Python Flask REST API
│   ├── routes/
│   │   ├── auth.py                # Register, login, profile avatar updates
│   │   ├── tasks.py               # CRUD, completion toggle, streak metrics
│   │   └── feedback.py            # User sentiment and feedback logging
│   ├── app.py                     # Application factory with CORS & Blueprints
│   ├── config.py                  # Auto-switching Supabase / SQLite configuration
│   ├── models.py                  # SQLAlchemy schema (User, Task, Feedback)
│   ├── test_api.py                # Pytest test suite (100% route coverage)
│   ├── requirements.txt           # Locked Python dependencies
│   └── .env.example               # Environment template
│
├── frontend/                      # React 19 + Tailwind v4 + Capacitor
│   ├── src/
│   │   ├── components/            # CartoonAvatar, AvatarPicker, AdBanner, Navbar, TaskCard
│   │   ├── pages/                 # Dashboard, Login, Register
│   │   ├── services/              # api.js (Axios + JWT), ads.js (AdMob + AdSense)
│   │   ├── App.jsx                # Router & global state
│   │   └── main.jsx               # Entrypoint
│   ├── android/                   # Native Android Studio project (Capacitor)
│   ├── capacitor.config.json      # App ID, scheme, and AdMob bindings
│   └── package.json
│
└── .github/
    └── workflows/
        └── ci.yml                 # Automated CI/CD (Pytest + Node 22 build)
```

---

## Economics & $0 Operating Cost Model

### Production Infrastructure Cost: **$0.00 / Month**
- **Web Frontend**: Cloudflare Pages / Vercel Edge (\$0/month free tier).
- **Backend API**: Render / Fly.io container (\$0/month free tier).
- **Relational Database**: Supabase PostgreSQL 500MB tier with connection pooling (\$0/month).
- **App Store Distribution**: One-time \$25 Google Play Developer lifetime fee.

### Integrated Monetization (Google AdMob / AdSense)
1. **AdMob Banner Ads**: Anchored at the bottom of the task dashboard.
2. **Rewarded Video Treats**: Users voluntarily watch a 15–30s sponsor video to earn extra companion treats, delivering high eCPMs (\$15–\$35 CPM in Tier-1 geos) without frustrating non-paying users.

---

## Quickstart Guide

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate   # Windows (Linux/macOS: source venv/bin/activate)

# Install dependencies
pip install -r requirements.txt

# Run automated tests
pytest -v test_api.py

# Launch Flask API server (Port 5000)
python app.py
```

### 2. Frontend Web Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server (Port 5173 with proxy to backend)
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 3. Native Android Build (Capacitor)

```bash
cd frontend

# Build production web bundle and sync with native Android container
npm run cap:build:android

# Open native project in Android Studio for emulator or APK generation
npm run cap:open:android
```

---

## Environment Configuration

Copy `backend/.env.example` to `backend/.env` and supply your credentials:

```ini
# Supabase PostgreSQL connection string
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Application Secrets
SECRET_KEY=your_secure_random_flask_secret
JWT_SECRET_KEY=your_secure_random_jwt_secret
JWT_EXPIRE_DAYS=30
```

*Note: If `DATABASE_URL` is omitted, the backend automatically initializes and uses a local SQLite database (`akohflow.db`) for seamless zero-config local development.*

---

## Automated CI/CD Pipeline

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) triggering on pushes to `main`, `master`, and `develop`:
1. **Backend Job**: Boots Python 3.12, installs dependencies, and runs the Pytest suite.
2. **Frontend Job**: Boots Node.js 22, installs dependencies, and verifies the production Vite build.

---

## Author

**Micheal Akoh-Idoko**
- Portfolio: [michealakohportfolio.vercel.app](https://michealakohportfolio.vercel.app/)
- LinkedIn: [linkedin.com/in/micheal-akoh](https://linkedin.com/in/micheal-akoh)
- GitHub: [@AkohMicheal](https://github.com/AkohMicheal)

---

## License

This project is licensed under the [MIT License](LICENSE).
