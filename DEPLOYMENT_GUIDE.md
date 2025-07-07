# 🚀 Deployment Guide: Ticket Support System

This guide will help you deploy your ticket management system to production.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **MongoDB Atlas Account** - For the database (free tier available)
3. **Render Account** - For backend hosting (free tier available)
4. **Vercel Account** - For frontend hosting (free tier available)

## 🗄️ Step 1: Setup MongoDB Atlas Database

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up or log in
3. Create a new project

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred region
4. Click "Create Cluster"

### 1.3 Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for production apps)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Prepare Your Repository
1. Push your code to GitHub if you haven't already:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Create Render Account
1. Go to [Render](https://render.com/)
2. Sign up with your GitHub account

### 2.3 Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `ticket-system-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.4 Set Environment Variables
In the Environment Variables section, add:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.xxxxx.mongodb.net/ticketsystem?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-random-string-here-at-least-32-characters
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

**Generate JWT Secret:**
```bash
# Run this in your terminal to generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://ticket-system-backend.onrender.com`

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Environment File
In your `frontend` directory, create `.env` file:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

### 3.2 Update Frontend for Production
Commit your environment changes:
```bash
cd frontend
git add .env
git commit -m "Add production environment variables"
git push origin main
```

### 3.3 Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.4 Set Environment Variables in Vercel
1. Go to your project settings
2. Click "Environment Variables"
3. Add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`

### 3.5 Deploy
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Note your frontend URL: `https://your-app-name.vercel.app`

## 🔄 Step 4: Update Backend CORS

### 4.1 Update Backend Environment
Go back to Render dashboard:
1. Open your backend service
2. Go to "Environment"
3. Update `FRONTEND_URL` with your actual Vercel URL:
```env
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
```

### 4.2 Redeploy Backend
The backend will automatically redeploy with the new environment variables.

## ✅ Step 5: Test Your Deployment

### 5.1 Test Backend
Visit `https://your-backend-url.onrender.com/` - you should see:
```json
{
  "message": "Ticket Support System API",
  "jwt_secret_configured": true,
  "mongodb_configured": true
}
```

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Try registering a new account
3. Create a test ticket
4. Upload an image
5. Add comments

## 🔧 Common Issues & Solutions

### Backend Issues

**Issue**: "Application failed to respond"
**Solution**: Check your logs in Render dashboard, ensure all environment variables are set

**Issue**: "MongoDB connection failed"
**Solution**: 
- Verify your MongoDB connection string
- Check if IP whitelist includes 0.0.0.0/0
- Ensure username/password are correct

**Issue**: "CORS errors"
**Solution**: Ensure `FRONTEND_URL` matches your exact Vercel domain

### Frontend Issues

**Issue**: "Network errors when making API calls"
**Solution**: 
- Verify `REACT_APP_API_URL` is correct
- Check if backend is running
- Ensure no trailing slashes in URLs

**Issue**: "Images not loading"
**Solution**: The image URLs should automatically use your backend domain

## 📊 Monitoring & Maintenance

### Render (Backend)
- Monitor logs in Render dashboard
- Free tier sleeps after 15 minutes of inactivity
- Consider upgrading for production use

### Vercel (Frontend)
- Check deployment logs in Vercel dashboard
- Automatic deployments on git push
- CDN provides fast global access

### MongoDB Atlas
- Monitor database performance in Atlas dashboard
- Free tier has 512MB storage limit
- Set up alerts for usage

## 🔐 Security Checklist

- ✅ Strong JWT secret (32+ characters)
- ✅ Database user has minimal required permissions
- ✅ Environment variables are secure
- ✅ CORS is properly configured
- ✅ MongoDB network access is restricted appropriately

## 🚀 Going Production Ready

For production use, consider:

1. **Upgrade hosting tiers** for better performance
2. **Custom domain names** for your frontend
3. **SSL certificates** (automatic with Vercel/Render)
4. **Database backups** and monitoring
5. **Error tracking** (Sentry, LogRocket)
6. **Performance monitoring** (New Relic, DataDog)

## 📞 Support

If you encounter issues:
1. Check the logs in your hosting platforms
2. Verify all environment variables
3. Test API endpoints directly
4. Check browser developer console for errors

---

**Note**: Free tiers have limitations. For production applications with significant traffic, consider upgrading to paid plans for better performance and reliability. 