# Urban Service Provider - Backend

## Requirements
- Node.js 18+
- MongoDB

## Install

```bash
cd backend
npm install
```

## Environment
Copy `.env.example` to `.env` and set values.

Required variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret for signing JWTs
- `PORT` - server port (default 5000)

## Scripts
- `npm run dev` - start with nodemon
- `npm start` - start production

## API
- `POST /api/users/register` - register
- `POST /api/users/login` - login
- `GET /api/services` - list services (supports query params for search, filter, pagination)
- `GET /api/services/nearby?lat=&lng=&radius=` - nearby services
- `POST /api/bookings/create` - create booking (protected)

Further endpoints are available for admin management.
