# 🚀 AI Prompt Library

A full-stack web application designed to help users store, categorize, and manage AI image generation prompts seamlessly. Built with a premium "glassmorphism" aesthetic, this library acts as a structured centralized hub to ditch messy notes and properly archive creativity.

---

## 🛠 Tech Stack

- **Frontend:** Angular 14 (TypeScript), Reactive Forms, custom modern CSS Design System
- **Backend:** Python + Django (leveraging raw Django Class-Based Views and JsonResponse payloads directly, strictly avoiding DRF for manual control)
- **Database:** PostgreSQL 15
- **Caching Layer:** Redis 7 (Acting as the isolated source-of-truth for view counters)
- **DevOps:** Docker & Docker Compose for single-command orchestration

---

## 📝 Features & Architectural Explanations

1. **Prompt Feed (List View)**: Uses Angular to dynamically map DB queries into CSS grid cards featuring interactive hover states and color-mapped complexity badges without browser reloading.
2. **Details & View Tracking**: Click a prompt to dynamically route to its contents. The Django backend seamlessly executes an atomic `incr` parameter to Redis passing the updated cache statistic directly into the detailed Angular UI template.
3. **Strict Validation Control**: Instead of failing silently, the App implements strict Angular `ReactiveFormsModule` interceptors AND hard-coded Python endpoint validators to immediately reject bad inputs (e.g. Prompts under 20 characters) and display custom error messages.
4. **Single Command Deploy**: Driven entirely by a comprehensive `docker-compose.yml` mapped to customized Angular and Python Dockerfiles ensuring safe abstraction.

### ⚖️ Assumptions & Trade-Offs
- We explicitly relied purely on standard Native Django Views (`View`, `JsonResponse`) to fulfill the JSON requirements without relying on Django Rest Framework (DRF) decorators, fulfilling the pure engineering test.
- The Angular container is mapped locally to port `4200` to allow for rapid UI hot-reloading development `ng serve`, prioritizing development stability dynamically in memory over complex NGNIX static chunk hosting.
- Bypassed CORS complexities tightly by globally setting `django-cors-headers` explicitly in setting configurations ensuring the container sub-networks interoperate securely.

---

## 🚀 Deployment Guide

### Option 1: Vercel (Frontend) + Railway/Render (Backend) - Recommended

#### Step 1: GitHub Setup
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository
# Go to https://github.com/new
# Create repository named "ai-prompt-library"
# Copy the repository URL

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/ai-prompt-library.git
git push -u origin master
```

#### Step 2: Deploy Backend to Railway (Free tier available)
1. Go to [Railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select `ai-prompt-library`
4. Railway will automatically detect the Dockerfile
5. Set environment variables:
   - `SECRET_KEY`: Generate a random secret key
   - `DEBUG`: `false`
   - `ALLOWED_HOSTS`: `*`
6. Railway provides PostgreSQL and Redis automatically
7. Deploy and get your backend URL (e.g., `https://ai-prompt-backend.up.railway.app`)

#### Step 3: Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Click "New Project" → "Import Git Repository"
3. Connect your GitHub account and select `ai-prompt-library`
4. Configure build settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/frontend`
5. Add environment variable:
   - `API_URL`: Your Railway backend URL (e.g., `https://ai-prompt-backend.up.railway.app`)
6. Click "Deploy"
7. Your frontend will be live at `https://ai-prompt-library.vercel.app`

#### Step 4: Update Backend CORS (if needed)
In Railway, add environment variable:
- `CORS_ALLOWED_ORIGINS`: `https://ai-prompt-library.vercel.app`

### Option 2: Full-Stack on Render (Free tier)
1. Go to [Render.com](https://render.com) and sign up
2. Create a new "Web Service" from your GitHub repo
3. Set build settings:
   - **Root Directory:** `backend`
   - **Runtime:** `Docker`
4. Add environment variables:
   - `DATABASE_URL`: Render provides PostgreSQL
   - `REDIS_URL`: Render provides Redis
   - `SECRET_KEY`: Random string
   - `DEBUG`: `false`
   - `ALLOWED_HOSTS`: `*`
5. Deploy backend
6. Deploy frontend separately using Vercel (same as Option 1, Step 3)

### Option 3: DigitalOcean App Platform
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub repo
3. Configure components:
   - **Backend Service:** Use `backend/` directory, Docker build
   - **Frontend Service:** Use `frontend/` directory, Node.js build
   - **Database:** PostgreSQL managed database
   - **Cache:** Redis managed cache
4. Set environment variables for both services
5. Deploy

### Option 4: Local Docker Deployment (Development)
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ai-prompt-library.git
cd ai-prompt-library

# Start all services
docker-compose up --build -d

# Access the application
# Frontend: http://localhost:4200
# Backend API: http://localhost:8000
```

---

## 💻 Setup & Installation Guide

### Prerequisites
Before starting, ensure your system has installed:
- [Docker](https://www.docker.com/products/docker-desktop/) (and Docker Compose)
- Node.js & Python (strictly for local script editing, otherwise not required as Docker orchestrates the node/python runtimes)
- Git

### How to Run via Docker Compose

Because the repository is fully contained with independent Dockerfiles and an entry-point Database Migration script, booting the entire architecture requires just a single command.

1. Clone this repository and navigate to the project root:
   ```bash
   cd ai-prompt-library
   ```

2. Spin up the application stack inside Docker:
   ```bash
   docker-compose up --build -d
   ```
   *(Note: The initial build will take a few minutes as Docker downloads the heavy PostgreSQL, Node Alpine, and Python slim base images).*

3. Once all containers (`db`, `redis`, `backend`, `frontend`) indicate they are running successfully, open your browser to the active services:
   - **Frontend UI:** `http://localhost:4200`
   - **Backend API:** `http://localhost:8000/prompts/`

---

## 🔍 API Endpoints Reference

All requests and responses map to application/json. 

- `GET /prompts/`
  Retrieves a timeline of all active prompts sorted closely by `created_at`.
- `POST /prompts/`
  Ingests a strictly validated Request body `{"title": string, "content": string, "complexity": number [1-10]}` and safely commits directly to PostgreSQL. 
- `GET /prompts/:id/` 
  Intercepts standard GET traffic, identifies the exact UUID matching PostgreSQL, isolates its identical tracker in Redis `(prompt:<uuid>:views)`, automatically iterates `incr`, and returns the blended JSON securely. 
