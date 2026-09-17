# Antiview Production Deployment Guide

This guide details deploying Antiview to cloud production environments using modern serverless or container platforms.

---

## 1. Architecture Deployment Overview

```
Frontend (Vercel / Netlify) ---> Backend (Render / Railway / Fly.io) ---> Database (MongoDB Atlas)
                                        |
                                        +---> AI Engine (Google Gemini 3.8 Flash)
```

---

## 2. Deploying MongoDB (MongoDB Atlas)

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Under **Security > Database Access**, create a user (e.g. `antiview_admin`).
3. Under **Security > Network Access**, add IP `0.0.0.0/0` (allow access from anywhere for cloud hosts).
4. Under **Database > Connect > Drivers**, copy the connection string:
   ```env
   MONGODB_URI=mongodb+srv://antiview_admin:<password>@cluster0.mongodb.net/antiview?retryWrites=true&w=majority
   ```

---

## 3. Deploying the Backend API (Render / Railway)

### Option A: Render
1. Create a new **Web Service** connected to your Antiview GitHub repository.
2. Configure settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default assigned by Render)
   - `CLIENT_URL`: `https://your-antiview-frontend.vercel.app`
   - `MONGODB_URI`: `<your_atlas_connection_string>`
   - `JWT_SECRET`: `<generated_random_64_char_hex_string>`
   - `GEMINI_API_KEY`: `<your_google_ai_studio_api_key>`
4. Deploy the service and record the backend URL (e.g. `https://antiview-api.onrender.com`).

---

## 4. Deploying the Frontend Client (Vercel)

### Option A: Vercel
1. In the Vercel Dashboard, click **Add New Project** and import the repository.
2. Configure Build & Development Settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Create a `client/vercel.json` file for SPA URL routing:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://antiview-api.onrender.com/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
4. Click **Deploy**. Your application is live at **[https://antriviewai.vercel.app](https://antriviewai.vercel.app)**.

---

## 5. Security Checklist for Production

- [ ] Ensure `.env` is never checked into Git (verified by root and server `.gitignore`).
- [ ] Set `NODE_ENV=production` on the server.
- [ ] Use a strong, randomly generated `JWT_SECRET` (at least 32 characters).
- [ ] Configure `CLIENT_URL` strictly to your production frontend domain to enforce CORS policies.
- [ ] Verify that the Google Gemini API Key is only referenced on the backend server.
