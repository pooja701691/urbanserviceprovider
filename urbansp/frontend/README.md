# Urban Service Provider Platform - Frontend

A modern, responsive React frontend for a comprehensive service provider marketplace built with Vite, React Router, and Recharts.

## Features

### 👥 User Panel (Public Access)
- **Service Discovery**: Browse all available services with detailed provider information
- **Search & Filter**: Find services and providers with real-time search
- **Provider Profiles**: View provider ratings, pricing, and detailed service information
- **Protected Booking**: 
  - Beautiful modal-based authentication popup for checkout
  - Seamless login/register flow
  - "Please Login to Continue" messaging
  - Modern blur background with animations

### 🔐 Authentication
- **Login/Register Pages**: Full authentication forms
- **Auth Modal**: Popup modal for accessing booking without page navigation
- **Auth Context**: Global state management for user sessions
- **Role-Based Access**: Support for User, Provider, and Admin roles
- **Persistent Sessions**: LocalStorage integration for session persistence

### 📊 User Dashboard
- **Booking Management**: View upcoming appointments and service requests
- **Saved Providers**: Quick access to favorite service professionals
- **Booking History**: View completed and in-progress bookings
- **Payment Methods**: Manage saved payment cards
- **Review Management**: Leave feedback on completed services

### 🏢 Provider Dashboard
- **Lead Management**: View and accept new service requests
- **Active Jobs**: Track current appointments
- **Performance Metrics**: Monitor ratings and reviews
- **Earnings Tracking**: View monthly income and revenue
- **Service Management**: Update availability and pricing

### 👨‍💼 Admin Panel (Complete)

#### Dashboard Analytics
- **Real-time Statistics**: Total users, bookings, services, revenue
- **Interactive Charts**:
  - Line chart for revenue & booking trends
  - Pie chart for service distribution
  - Bar charts for performance metrics
  - Area charts for growth tracking
- **Recent Bookings Table**: Latest transactions with status badges
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile

#### Services Management
- **Service Directory**: Add, edit, and manage service categories
- **Provider Assignment**: Link providers to services
- **Service Statistics**: Track active providers per service
- **Bulk Operations**: Export and manage services

#### Providers Management
- **Provider Verification**: Approve or reject new providers
- **Performance Monitoring**: View ratings and reviews
- **Location Tracking**: Manage service areas and cities
- **Document Management**: Verify certifications and credentials

#### Bookings Management
- **Status Tracking**: Monitor booking progression
- **Filter Views**: Filter by status (completed, in-progress, pending)
- **Revenue Tracking**: View booking amounts and payments
- **Customer Service**: Handle disputes and refunds

#### Users Management
- **User Directory**: View all registered users
- **Account Information**: Email, phone, joined date
- **Activity Metrics**: Track booking history
- **User Insights**: Export user data and analytics

#### Advanced Analytics
- **Growth Charts**: User growth over time
- **Revenue Analysis**: Monthly and yearly trends
- **Booking Patterns**: Peak hours and popular services
- **Performance Metrics**: Platform KPIs and benchmarks

### 🎨 Design & UX
- **Modern Interface**: Clean, professional design inspired by Urban Company and JustDial
- **Responsive Design**: Fully responsive on mobile (320px), tablet (768px), and desktop (1920px+)
- **Sidebar Navigation**: Collapsible admin sidebar with icons
- **Status Badges**: Color-coded status indicators
- **Interactive Charts**: Hover effects and detailed tooltips
- **Smooth Animations**: Slide-up modals, transitions, and hover states

## Technology Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.1
- **Router**: React Router 6.16.0
- **Charts**: Recharts 2.10.3
- **HTTP Client**: Axios 1.5.1
- **Styling**: Custom CSS with CSS Grid and Flexbox

## Project Structure

```
frontend/
├── public/                  # Static assets (SVG images)
├── src/
│   ├── api/                # API integration
│   │   └── axios.js        # Axios instance configuration
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx      # Navigation header
│   │   ├── Footer.jsx      # Footer section
│   │   ├── Sidebar.jsx     # Admin sidebar
│   │   ├── AuthModal.jsx   # Login/Register modal
│   │   ├── ProviderCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── BookingForm.jsx
│   │   ├── ReviewCard.jsx
│   │   └── Loader.jsx
│   ├── context/            # Global state management
│   │   └── AuthContext.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProviderDetails.jsx
│   │   ├── BookingPage.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── ProviderDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminServices.jsx
│   │   ├── AdminProviders.jsx
│   │   ├── AdminBookings.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminAnalytics.jsx
│   │   └── NotFound.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── services/           # API service functions
│   │   ├── authService.js
│   │   ├── providerService.js
│   │   ├── bookingService.js
│   │   └── reviewService.js
│   ├── styles/
│   │   └── index.css       # Global styles
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── .env
└── README.md
```

## Setup & Installation

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**:
   Create `.env` file:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Development server**:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

4. **Production build**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Key Features in Detail

### Auth Modal
- Triggered when unauthenticated user clicks "Book Now"
- Smooth slide-up animation with blur background
- Flip between Login and Register modes
- Real-time form validation
- Error handling and feedback

### Admin Sidebar
- **Collapsible**: Click toggle button to minimize sidebar
- **Icon-Only Mode**: Shows only icons when collapsed
- **Quick Navigation**: Links to all admin sections
- **Active State**: Highlights current page
- **Responsive**: Becomes horizontal navbar on mobile

### Dashboard Charts
- **Real-time Data**: Mock data demonstrates chart capabilities
- **Hover Tooltips**: Detailed information on hover
- **Responsive**: Charts adapt to container width
- **Multiple Variants**: Line, Bar, Pie, and Area charts

### Status Badges
- **Color-coded**: Green (Completed), Blue (In Progress), Orange (Pending)
- **Consistent**: Used across all tables and cards
- **Accessible**: High contrast for visibility

## API Integration

All API calls are configured through service modules in `src/services/`:

```javascript
// Example: authService.js
import api from '../api/axios';

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}
```

Backend endpoints expected:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/providers`
- `GET /api/providers/:id`
- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/providers/:id/reviews`

## Responsive Breakpoints

- **Mobile**: 320px - 767px (single column, hamburger menu)
- **Tablet**: 768px - 1023px (2-column grid)
- **Desktop**: 1024px+ (full layout with sidebars)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **CSS**: 14.04 KB (gzipped: 3.46 KB)
- **JavaScript**: 626.61 KB (gzipped: 174.99 KB)
- **Build Time**: ~4.7 seconds
- **Code Split**: Enabled for better performance

## Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Real-time notifications (Socket.io)
- [ ] Video call support for consultations
- [ ] Advanced filtering and faceted search
- [ ] Map-based provider discovery
- [ ] Mobile app (React Native)
- [ ] Dark mode toggle
- [ ] Multi-language support

## Contributing

To add new features:

1. Create feature branch: `git checkout -b feature/name`
2. Make changes in appropriate folder
3. Test thoroughly
4. Submit pull request

## License

MIT License - feel free to use this project as template

## Support

For issues or questions, please open an issue on the project repository.

---

Built with ❤️ for Urban Service Provider Platform
