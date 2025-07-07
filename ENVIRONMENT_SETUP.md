# 🔧 Environment Files Setup

Before deploying, you need to create these environment files:

## 🖥️ Backend Environment (.env)

Create `backend/.env` file:

```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string_here

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## 🌐 Frontend Environment (.env)

Create `frontend/.env` file:

```env
# API Configuration
REACT_APP_API_URL=https://your-backend-domain.onrender.com/api
```

## 🛠️ Development Environment

For local development, use:

**Backend `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/ticketsystem
JWT_SECRET=your_development_jwt_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env**:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Quick Setup Commands

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Create backend .env
cd backend
touch .env
# Add your environment variables

# Create frontend .env
cd ../frontend
touch .env
# Add your environment variables
```

**Note**: Never commit `.env` files to version control! They're already in `.gitignore`. 