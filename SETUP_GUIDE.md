# The Old Vine Hotel - Complete Website Solution

![The Old Vine Hotel](https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800)

## 🏨 Project Overview

A comprehensive, production-ready hotel website built with modern technologies, featuring advanced booking capabilities, PMS integration, and multi-platform connectivity. This solution provides everything needed for a luxury hotel's digital presence.

## ✨ Key Features

### 🎯 Core Functionality
- **Modern Responsive Design** - Elegant UI with mobile-first approach
- **Real-time Booking Engine** - Complete reservation system with availability checking
- **Secure Payment Processing** - Stripe integration for safe transactions
- **Multi-language Support** - English, Arabic, French with easy expansion
- **Guest Management System** - Comprehensive profile and loyalty program management
- **Admin Dashboard** - Full control panel for hotel operations

### 🔗 Enterprise Integrations
- **Opera PMS Integration** - Real-time synchronization with hotel management system
- **Booking Platform APIs** - Ready connections to Booking.com, Trip.com, Expedia
- **Channel Manager Ready** - Synchronized rates and availability across all platforms
- **Revenue Management** - Advanced analytics and reporting capabilities

### 🛡️ Security & Performance
- **JWT Authentication** - Secure user sessions and API access
- **Rate Limiting** - Protection against abuse and attacks
- **Input Validation** - Comprehensive data sanitization
- **Error Handling** - Robust error management and logging
- **Performance Optimization** - Caching, compression, and efficient queries

## 🚀 Technology Stack

### Frontend
- **React.js 18** - Modern UI framework
- **Material-UI (MUI)** - Professional component library
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Efficient data fetching and caching
- **React Router** - Client-side routing
- **i18next** - Internationalization framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Winston** - Logging framework
- **Helmet** - Security middleware

### Integrations
- **Opera PMS** - Property Management System
- **Booking.com API** - OTA integration
- **Expedia EQC** - Channel connectivity
- **Trip.com API** - Asian market integration
- **Google Maps** - Location services
- **WhatsApp Business** - Customer communication

## 📋 Prerequisites

Before installation, ensure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn** package manager
- **Stripe Account** (for payments)
- **Email Service** (Gmail, SendGrid, etc.)
- **Google Maps API Key**

## 🛠️ Installation Guide

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd old-vine-hotel-website

# Install all dependencies
npm run install-all
```

### 2. Environment Configuration

#### Server Environment (.env)
```bash
# Copy the example file
cp server/.env.example server/.env

# Edit with your configuration
nano server/.env
```

#### Client Environment
```bash
# Create client environment file
cp client/.env.example client/.env

# Add your configuration
echo "REACT_APP_API_URL=http://localhost:5000" > client/.env
echo "REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_..." >> client/.env
```

### 3. Database Setup

```bash
# Start MongoDB service
sudo systemctl start mongod

# Create database and seed initial data
cd server
npm run seed
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# Backend only
npm run server

# Frontend only
npm run client
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Configuration Guide

### Payment Setup (Stripe)

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the dashboard
3. Add to your environment files:
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### Email Configuration

#### Using Gmail
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Use App Password, not regular password
```

#### Using SendGrid
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Google Maps Integration

1. Get API key from Google Cloud Console
2. Enable Maps JavaScript API
3. Add to environment:
   ```bash
   GOOGLE_MAPS_API_KEY=your-api-key
   ```

### Opera PMS Integration

```bash
OPERA_PMS_URL=https://your-opera-server.com/api
OPERA_PMS_USERNAME=your-username
OPERA_PMS_PASSWORD=your-password
OPERA_PMS_PROPERTY_CODE=your-property-code
```

### Booking Platform APIs

#### Booking.com
```bash
BOOKING_COM_API_URL=https://distribution-xml.booking.com
BOOKING_COM_USERNAME=your-username
BOOKING_COM_PASSWORD=your-password
BOOKING_COM_HOTEL_ID=your-hotel-id
```

#### Expedia
```bash
EXPEDIA_EQC_URL=https://services.expediapartnercentral.com
EXPEDIA_USERNAME=your-username
EXPEDIA_PASSWORD=your-password
EXPEDIA_HOTEL_ID=your-hotel-id
```

## 🗂️ Project Structure

```
old-vine-hotel-website/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── common/    # Shared components
│   │   │   └── layout/    # Layout components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   ├── locales/       # Translation files
│   │   └── styles/        # CSS and theme files
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   └── package.json
├── docs/                 # Documentation
├── deployment/           # Deployment configurations
└── README.md
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Guest registration
- `POST /api/auth/login` - Guest login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset

### Booking Endpoints
- `GET /api/rooms` - List available rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/availability` - Check availability
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:bookingNumber` - Get booking details
- `PUT /api/bookings/:bookingNumber/cancel` - Cancel booking

### Integration Endpoints
- `GET /api/integrations/health` - Check integration status
- `POST /api/integrations/opera/sync-rooms` - Sync with Opera PMS
- `POST /api/integrations/sync-rates` - Update rates across platforms
- `GET /api/integrations/analytics/revenue` - Revenue analytics

### Contact & Information
- `POST /api/contact` - Send contact message
- `POST /api/contact/newsletter` - Newsletter subscription
- `GET /api/contact/info` - Hotel information

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with secure token management
- Role-based access control (Guest, Admin)
- Password hashing with bcrypt
- Email verification for new accounts

### API Security
- Rate limiting to prevent abuse
- CORS configuration for cross-origin requests
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers

### Data Protection
- Encrypted sensitive data storage
- Secure payment processing with Stripe
- GDPR compliance features
- Audit logging for admin actions

## 📊 Performance Optimization

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization and caching
- Gzip compression
- Service worker for offline capability
- React Query for efficient data fetching

### Backend Optimization
- Database indexing for fast queries
- Response caching with Redis
- Connection pooling
- Efficient aggregation pipelines
- Background job processing

## 🌐 Deployment Options

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment

#### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy dist folder
```

#### Backend (Heroku/DigitalOcean)
```bash
cd server
npm start
```

### Environment-Specific Configurations

#### Production Environment
- Use production database
- Enable SSL/HTTPS
- Configure CDN for assets
- Set up monitoring and alerts
- Enable backup strategies

#### Staging Environment
- Use staging database
- Enable detailed logging
- Test payment integrations
- Validate third-party APIs

## 🎨 Customization Guide

### Theme Customization

The design uses a sophisticated color palette that can be easily customized:

```javascript
// client/src/theme.js
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Change to your brand color
    },
    secondary: {
      main: '#D4AF37', // Change accent color
    },
  },
});
```

### Logo Integration

1. Replace logo files in `client/public/`
2. Update logo references in Header component
3. Adjust sizing and positioning as needed

### Content Management

- Room information: Update `server/models/Room.js`
- Hotel details: Modify `server/routes/contact.js`
- Translations: Edit files in `client/src/locales/`

### Email Templates

Customize email templates in `server/utils/sendEmail.js`:
- Booking confirmations
- Cancellation notifications
- Newsletter templates
- Contact form responses

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Test Coverage

- Unit tests for models and utilities
- Integration tests for API endpoints
- End-to-end tests for booking flow
- Payment integration testing

## 📈 Monitoring & Analytics

### Application Monitoring

- Winston logging for error tracking
- Performance metrics collection
- Health check endpoints
- Integration status monitoring

### Business Analytics

- Booking conversion tracking
- Revenue analytics
- Guest behavior insights
- Platform performance comparison

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart if needed
sudo systemctl restart mongod
```

#### Payment Processing Errors
- Verify Stripe API keys
- Check webhook configurations
- Validate test card numbers

#### Integration Failures
- Test API credentials
- Check network connectivity
- Verify webhook endpoints

### Getting Help

- Check logs in `server/logs/`
- Review API responses
- Test with curl commands
- Contact support team

## 🔄 Maintenance

### Regular Updates

- Update dependencies monthly
- Review security patches
- Monitor API changes
- Backup database regularly

### Performance Monitoring

- Database query optimization
- API response times
- Error rate tracking
- User experience metrics

## 📞 Support

For technical support and questions:

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests
- **General**: Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Developed by MiniMax Agent** - A comprehensive hotel management solution designed for modern hospitality businesses.

*Experience luxury and elegance with The Old Vine Hotel - where technology meets hospitality.*