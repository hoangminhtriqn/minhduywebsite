# Deployment Guide

## MongoDB Atlas Configuration

### 1. Whitelist IP Addresses

1. Go to MongoDB Atlas Dashboard
2. Navigate to "Network Access" in the left sidebar
3. Click "ADD IP ADDRESS"
4. Click "ALLOW ACCESS FROM ANYWHERE" (adds `0.0.0.0/0`)
5. Click "Confirm"

### 2. Environment Variables

Set these environment variables in your deployment platform:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
PORT=3000
FRONTEND_URL=https://your-frontend-url.onrender.com
JWT_SECRET=your-jwt-secret-key
```

## Render Deployment

### 1. Build Command

```
yarn install && node migrate.js --force
```

### 2. Start Command

```
yarn start
```

### 3. Environment Variables

Add all required environment variables in Render dashboard:

- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`

## Migration Strategy

### Force Migration

- The build process includes `node migrate.js --force`
- This ensures fresh data is created on each deployment
- Existing data will be cleared and recreated
- Useful for development and testing environments

### Manual Migration Commands

```bash
# Normal migration (skips if data exists)
yarn migrate

# Force migration (clears and recreates all data)
yarn migrate:force
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check MONGO_URI format and credentials
- Verify network connectivity

### Migration Issues

- Check if MONGO_URI is properly set
- Ensure database user has proper permissions
- Check MongoDB Atlas cluster status
- Force migration will clear existing data - use with caution in production

### CORS Issues

- Verify FRONTEND_URL is correctly set
- Check allowed origins in server.js
- Ensure frontend URL matches CORS configuration
