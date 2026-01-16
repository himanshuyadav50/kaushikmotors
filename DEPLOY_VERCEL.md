# Deploying to Vercel

This project is configured for deployment on Vercel.

## Prerequisites

1.  **GitHub Account**: Push this code to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **MongoDB Atlas**: Ensure you have your MongoDB connection string.

## Steps to Deploy

1.  **Push to GitHub**:
    *   Initialize git if not already: `git init`, `git add .`, `git commit -m "Initial commit"`
    *   Create a repo on GitHub and push.

2.  **Import in Vercel**:
    *   Go to your Vercel Dashboard.
    *   Click "Add New..." -> "Project".
    *   Import your GitHub repository.

3.  **Configure Project**:
    *   **Framework Preset**: Select **Vite**.
    *   **Root Directory**: `./` (leave default).
    *   **Build Command**: `vite build` (default).
    *   **Output Directory**: `dist` (default).

4.  **Environment Variables**:
    *   Add the following variables in the Vercel Project Settings:
        *   `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb+srv://...`).
        *   `JWT_SECRET`: A secure random string.
        *   `VITE_API_URL`: Set this to `/api` (this ensures frontend calls the backend on the same domain).

5.  **Deploy**:
    *   Click "Deploy".
    *   Vercel will build the frontend and set up the serverless functions for the API based on `vercel.json`.

## serverless Configuration
The `vercel.json` file handles routing all `/api/*` requests to the Express app located at `app/api/index.ts`.
