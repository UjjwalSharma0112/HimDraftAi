# HimShakti AI Product Copy Generator

AI-powered e-commerce product description generator for traditional Himalayan food products.

![Project Preview](./frontend/public/logo.png)

---

## 🌐 Live Deployment & Documentation

### 🚀 Production URLs
- **Frontend App (Vercel)**: [https://himshakti-ai.vercel.app](https://himshakti-ai.vercel.app) *(Replace with your live Vercel URL)*
- **Backend API (Render)**: [https://himshakti-ai-backend.onrender.com](https://himshakti-ai-backend.onrender.com) *(Replace with your live Render URL)*
- **Health Check Endpoint**: [https://himshakti-ai-backend.onrender.com/api/health](https://himshakti-ai-backend.onrender.com/api/health)

---

### 🛠️ Tech Stack Summary

| Layer | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite | High-performance single page client |
| **Styling & UI** | Tailwind CSS + Google Fonts | Himalayan organic dark/light design system |
| **Backend Framework** | Express.js + TypeScript | RESTful API server & middleware routing |
| **Database** | MongoDB Atlas (Mongoose ORM) | Cloud document store for product & copy data |
| **AI Engine** | Google Gemini API (`@google/generative-ai`) | Generates structured Himalayan product copy |
| **Authentication** | JWT + Passport.js (Google OAuth 2.0) | Secure token-based auth & social login |
| **Hosting & Infra** | Vercel (Frontend) + Render (Backend) | CI/CD cloud deployment |

---

### 🔑 Production Environment Variables Setup

#### 1. Backend Environment Variables (Render Dashboard)
Set these keys under **Render Dashboard $\rightarrow$ Environment**:

| Variable Name | Description | Example / Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Mode indicator | `production` |
| `PORT` | Web server port | `8080` |
| `CLIENT_URL` | Live Vercel frontend URL for CORS & OAuth | `https://himshakti-ai.vercel.app` |
| `MONGO_URI` | MongoDB Atlas cloud connection string | `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/himdraftai` |
| `JWT_SECRET` | Secret key for signing auth tokens | `<your-secure-random-jwt-secret>` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud | `<your-client-id>.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret from Google Cloud | `<your-client-secret>` |
| `GOOGLE_CALLBACK_URL` | OAuth redirect endpoint on backend | `https://himshakti-ai-backend.onrender.com/api/auth/google/callback` |
| `GEMINI_API_KEY` | Google Gemini AI key for generation | `<your-gemini-api-key>` |

#### 2. Frontend Environment Variables (Vercel Dashboard)
Set this key under **Vercel Dashboard $\rightarrow$ Settings $\rightarrow$ Environment Variables**:

| Variable Name | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Live Render backend API base URL | `https://himshakti-ai-backend.onrender.com/api` |

---

### 🚀 Step-by-Step Deployment Guide

#### 1. Database Configuration (MongoDB Atlas)
1. Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** $\rightarrow$ **Add IP Address** $\rightarrow$ Add `0.0.0.0/0` (Allow Access from Anywhere) to permit Render's dynamic IP instances.
3. Copy your MongoDB connection string (`MONGO_URI`).

#### 2. Backend Deployment (Render Web Service)
1. Sign in to [Render.com](https://render.com) and click **New $\rightarrow$ Web Service**.
2. Connect your GitHub repository.
3. Configure the following build settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add all Backend Environment Variables listed above.
5. Click **Deploy Web Service** and save your assigned Render URL.

#### 3. Frontend Deployment (Vercel)
1. Sign in to [Vercel.com](https://vercel.com) and click **Add New $\rightarrow$ Project**.
2. Import your GitHub repository.
3. Configure Framework & Directory:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
4. Add `VITE_API_URL` pointing to your Render backend API (`https://<your-render-url>/api`).
5. Click **Deploy**.

---

### ⚠️ Known Free Tier Limitations

> [!NOTE]
> **1. Render Free Tier Idle Sleep (Cold Starts)**
> Render's free web service tier automatically enters sleep mode after 15 minutes of inactivity. The initial HTTP request after an idle period may take **30 to 60 seconds** to wake up the server container. Subsequent requests run at normal fast speeds.

> [!TIP]
> **2. MongoDB Atlas Network Access**
> Ensure `0.0.0.0/0` is whitelisted in Atlas Network Access so Render backend instances can establish database connections smoothly without IP rejection.

> [!IMPORTANT]
> **3. Google OAuth Redirect URIs**
> If Google Login is active, ensure both your Vercel frontend domain (`https://himshakti-ai.vercel.app`) and Render callback URI (`https://himshakti-ai-backend.onrender.com/api/auth/google/callback`) are added to **Authorized Redirect URIs** in Google Cloud Console.

---

## Database Architecture

### Why We Chose MongoDB Atlas
For HimDraftAI, we selected **MongoDB Atlas** as our primary database. Because the core of the application deals with generating rich, unstructured, and highly variable product information (ranging from lists of organic ingredients to changing product feature tags, and multiple versions of AI-generated marketing copy), a document-oriented database fits our data model perfectly. 

Using MongoDB's flexible, schema-less approach allows us to iterate rapidly. We can expand our product descriptions, add rich analytics logs, or introduce new metadata schemas down the line without needing to perform slow or risky database schema migrations.

### Schema Diagram
The database relationships and schema structure are outlined below:

![Database Schema Diagram](./schemadiagram.png)

---

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A running MongoDB instance (locally or hosted on MongoDB Atlas)

### Setting Up the Backend
1. Navigate to the `backend` directory.
2. Copy `.env.example` to create your `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Fill in your local or Atlas credentials in `backend/.env`.
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Setting Up the Frontend
1. Navigate to the `frontend` directory.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies and start the frontend development server:
   ```bash
   npm install
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.
