# Urban Service Provider Platform (USP)

A full-stack web application that connects customers with local service professionals (cleaning, plumbing, AC repair, etc.).

## Tech Stack

- **Frontend**: React 18 + Vite + React Router v6 + Recharts + Axios
- **Backend**: Node.js + Express + MongoDB (Mongoose) + JWT Auth
- **Cloud**: Cloudinary (image uploads) · Google Maps Embed API (nearby map)

---

## Prerequisites

- Node.js ≥ 18
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI
- (Optional) Cloudinary account for image uploads
- (Optional) Google Maps API key for the Nearby Services map

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env   # then fill in your values
npm install
npm run seed           # seed admin + test user + sample services
npm run dev            # starts on http://localhost:5000
```

**.env values:**
| Key | Description |
|-----|-------------|
| `MONGO_URI` | MongoDB URI e.g. `mongodb://127.0.0.1:27017/usp` |
| `JWT_SECRET` | Any long random string |
| `CLOUDINARY_URL` | From your Cloudinary dashboard (optional) |
| `PORT` | Default `5000` |

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # add your keys
npm install
npm run dev            # starts on http://localhost:5173
```

**.env values:**
| Key | Description |
|-----|-------------|
| `VITE_API_URL` | Backend URL, default `http://localhost:5000/api` |
| `VITE_GOOGLE_MAPS_KEY` | Google Maps Embed API key (optional, map won't show without it) |

---

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@usp.com | password123 |
| User | user@usp.com | password123 |

---

## API Endpoints

### Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/users/register` | — | Register |
| POST | `/api/users/login` | — | Login |
| GET | `/api/users/profile` | User | Get profile |
| PUT | `/api/users/profile` | User | Update profile + avatar |
| GET | `/api/users` | Admin | All users |
| PUT | `/api/users/role/:id` | Admin | Change user role |

### Services
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/services` | — | List (search, filter, paginate) |
| GET | `/api/services/nearby` | — | Geo search (`?lat=&lng=&radius=&limit=`) |
| GET | `/api/services/:id` | — | Single service |
| POST | `/api/services/:id/reviews` | User | Add review |
| POST | `/api/services/create` | Admin | Create (multipart) |
| PUT | `/api/services/update/:id` | Admin | Update (multipart) |
| DELETE | `/api/services/delete/:id` | Admin | Delete |

### Bookings
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/bookings/create` | User | Create booking |
| GET | `/api/bookings` | User/Admin | My bookings / all bookings |
| PUT | `/api/bookings/status/:id` | Admin | Change status |
| PUT | `/api/bookings/cancel/:id` | User | Cancel own booking |

### Admin
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/analytics` | Admin | Platform-wide stats |

---

## Features

- JWT auth with role-based access (user / admin)
- MongoDB geospatial nearby search (`$near` + `2dsphere` index)
- Cloudinary image uploads for services and avatars
- Admin dashboard with live analytics charts
- Booking management with status workflow
- User review system with average rating recalculation
- Responsive UI with collapsible admin sidebar
- Google Maps embed on Nearby Services page
