# The Old Vine Hotel - Development Documentation

## 🏗️ Architecture Overview

This hotel management system follows a modern, scalable architecture designed for enterprise-level operations.

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│   Express API   │────│    MongoDB      │
│  (Port 3000)    │    │  (Port 5000)    │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   Integrations  │              │
         │              └─────────────────┘              │
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────│   External APIs │──────────────┘
                        │ • Opera PMS     │
                        │ • Booking.com   │
                        │ • Expedia       │
                        │ • Trip.com      │
                        │ • Stripe        │
                        └─────────────────┘
```

## 🛠️ Development Setup

### Prerequisites

```bash
# Install Node.js (v16+)
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Environment Setup

#### Development Database
```bash
# Create development database
mongo
use oldvinehotel_dev
db.createUser({
  user: "hotel_admin",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

#### Environment Variables

**Server (.env)**
```bash
# Development configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://hotel_admin:secure_password@localhost:27017/oldvinehotel_dev

# Security
JWT_SECRET=your_super_secret_jwt_key_for_development
JWT_EXPIRES_IN=7d

# External APIs (Development keys)
STRIPE_SECRET_KEY=sk_test_your_development_key
GOOGLE_MAPS_API_KEY=your_development_maps_key

# Email (Development)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_pass
```

**Client (.env)**
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_development_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_development_maps_key
```

## 📊 Database Schema

### Core Models

#### Room Model
```javascript
{
  name: String,              // "Deluxe Ocean Suite"
  type: String,              // "Suite", "Deluxe", etc.
  roomNumber: String,        // "101", "201A"
  basePrice: Number,         // 299.99
  maxOccupancy: Number,      // 4
  amenities: [String],       // ["WiFi", "Ocean View"]
  status: String,            // "Available", "Occupied"
  operaRoomId: String,       // PMS integration ID
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }]
}
```

#### Booking Model
```javascript
{
  bookingNumber: String,     // "OVH202512345"
  confirmationCode: String,  // "ABC12345"
  guest: ObjectId,           // Reference to Guest
  room: ObjectId,            // Reference to Room
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: {
    adults: Number,
    children: Number
  },
  totalAmount: Number,
  paymentStatus: String,     // "Paid", "Pending"
  status: String,            // "Confirmed", "Cancelled"
  stripePaymentIntentId: String
}
```

#### Guest Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,          // Hashed
  loyaltyProgram: {
    tier: String,            // "Bronze", "Silver", "Gold"
    points: Number
  },
  preferences: {
    roomType: String,
    language: String
  },
  totalStays: Number,
  isVIP: Boolean
}
```

### Database Indexes

```javascript
// Room indexes for performance
db.rooms.createIndex({ "roomNumber": 1 }, { unique: true })
db.rooms.createIndex({ "type": 1, "status": 1 })
db.rooms.createIndex({ "operaRoomId": 1 })

// Booking indexes
db.bookings.createIndex({ "bookingNumber": 1 }, { unique: true })
db.bookings.createIndex({ "confirmationCode": 1 })
db.bookings.createIndex({ "checkInDate": 1, "checkOutDate": 1 })
db.bookings.createIndex({ "guest": 1 })
db.bookings.createIndex({ "room": 1 })

// Guest indexes
db.guests.createIndex({ "email": 1 }, { unique: true })
db.guests.createIndex({ "loyaltyProgram.tier": 1 })
```

## 🔌 API Design

### RESTful API Structure

```
GET    /api/rooms                    # List rooms with filters
GET    /api/rooms/:id                # Get specific room
POST   /api/rooms/:id/availability   # Check availability

POST   /api/bookings                 # Create booking
GET    /api/bookings/:bookingNumber  # Get booking details
PUT    /api/bookings/:id/cancel      # Cancel booking

POST   /api/auth/register            # Guest registration
POST   /api/auth/login               # Guest login
GET    /api/auth/me                  # Current user info

POST   /api/contact                  # Send contact message
GET    /api/contact/info             # Hotel information
```

### Response Format

```javascript
// Success Response
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}

// Paginated Response
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalCount": 100,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## 🔐 Authentication Flow

### JWT Implementation

```javascript
// Token Generation
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Token Verification Middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

### Password Security

```javascript
// Password Hashing (in model)
guestSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password Comparison
guestSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

## 💳 Payment Integration

### Stripe Implementation

```javascript
// Create Payment Intent
const createPayment = async (amount, bookingData) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      bookingNumber: bookingData.bookingNumber,
      guestEmail: bookingData.guest.email
    }
  });
  
  return paymentIntent;
};

// Handle Webhook
const handleStripeWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed.`);
  }
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
  }
  
  res.json({ received: true });
};
```

## 🔗 Integration Services

### Opera PMS Integration

```javascript
class OperaPMSService {
  async createReservation(booking) {
    const xmlRequest = this.generateXMLRequest('OTA_HotelResRQ', {
      // XML structure for Opera PMS
    });
    
    const response = await this.client.post('/reservations', xmlRequest);
    return this.parseXMLResponse(response.data);
  }
  
  async syncAvailability() {
    // Sync room availability with Opera PMS
  }
  
  async updateRates(roomType, rates) {
    // Update room rates in Opera PMS
  }
}
```

### Booking Platform APIs

```javascript
// Booking.com Integration
class BookingComService {
  async updateAvailability(roomType, dates, availability) {
    const xmlRequest = this.buildAvailabilityXML(roomType, dates, availability);
    return this.sendRequest(xmlRequest);
  }
  
  async processWebhook(webhookData) {
    switch (webhookData.event_type) {
      case 'booking_created':
        await this.importBooking(webhookData);
        break;
      case 'booking_cancelled':
        await this.cancelBooking(webhookData);
        break;
    }
  }
}
```

## 🎨 Frontend Architecture

### React Component Structure

```
src/
├── components/
│   ├── common/              # Shared components
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── layout/              # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Sidebar/
│   └── booking/             # Booking-specific components
│       ├── RoomCard/
│       ├── BookingForm/
│       └── PaymentForm/
├── pages/                   # Page components
├── services/                # API services
├── hooks/                   # Custom React hooks
├── utils/                   # Utility functions
└── context/                 # React contexts
```

### State Management

```javascript
// React Query for server state
const { data: rooms, isLoading } = useQuery(
  ['rooms', filters],
  () => roomsAPI.getRooms(filters),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  }
);

// Context for global state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### API Service Layer

```javascript
// API service structure
class RoomsAPI {
  async getRooms(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/rooms?${params}`);
    return response.data;
  }
  
  async checkAvailability(roomId, dates) {
    const response = await api.post(`/rooms/${roomId}/availability`, dates);
    return response.data;
  }
  
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  }
}

export const roomsAPI = new RoomsAPI();
```

## 🧪 Testing Strategy

### Backend Testing

```javascript
// Unit Tests (Jest)
describe('Room Model', () => {
  test('should calculate current price with seasonal pricing', () => {
    const room = new Room({
      basePrice: 200,
      seasonalPricing: [{
        season: 'summer',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        priceMultiplier: 1.5
      }]
    });
    
    expect(room.currentPrice).toBe(300);
  });
});

// Integration Tests
describe('Booking API', () => {
  test('POST /api/bookings should create booking', async () => {
    const bookingData = {
      roomId: 'room123',
      checkInDate: '2024-06-01',
      checkOutDate: '2024-06-03',
      guestInfo: { /* guest data */ }
    };
    
    const response = await request(app)
      .post('/api/bookings')
      .send(bookingData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.booking).toBeDefined();
  });
});
```

### Frontend Testing

```javascript
// Component Tests (React Testing Library)
import { render, screen, fireEvent } from '@testing-library/react';
import BookingForm from '../BookingForm';

test('should submit booking form with valid data', async () => {
  render(<BookingForm />);
  
  fireEvent.change(screen.getByLabelText(/check-in date/i), {
    target: { value: '2024-06-01' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /book now/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
  });
});
```

## 📊 Performance Optimization

### Database Optimization

```javascript
// Efficient aggregation for room availability
const getAvailableRooms = async (checkIn, checkOut) => {
  return Room.aggregate([
    {
      $match: {
        status: 'Available',
        isActive: true
      }
    },
    {
      $lookup: {
        from: 'bookings',
        let: { roomId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$room', '$$roomId'] },
              status: { $in: ['Confirmed', 'Checked In'] },
              $or: [
                {
                  checkInDate: { $lt: checkOut },
                  checkOutDate: { $gt: checkIn }
                }
              ]
            }
          }
        ],
        as: 'conflictingBookings'
      }
    },
    {
      $match: {
        conflictingBookings: { $size: 0 }
      }
    }
  ]);
};
```

### Frontend Optimization

```javascript
// Code splitting and lazy loading
const Booking = lazy(() => import('./pages/Booking'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

// Memoization for expensive calculations
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});

// Image optimization
const OptimizedImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src + '?w=50&q=10'); // Placeholder
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageSrc(src);
    img.src = src;
  }, [src]);
  
  return <img src={imageSrc} alt={alt} {...props} />;
};
```

## 🔍 Monitoring & Logging

### Application Logging

```javascript
// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ 
      filename: 'logs/bookings.log',
      format: winston.format((info) => {
        return info.type === 'booking' ? info : false;
      })()
    })
  ]
});

// Usage in application
logger.info('Booking created', {
  type: 'booking',
  bookingId: booking._id,
  guestEmail: booking.guest.email,
  amount: booking.totalAmount
});
```

### Health Monitoring

```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      external_apis: await checkExternalAPIs()
    }
  };
  
  const isHealthy = Object.values(healthCheck.checks).every(check => check.status === 'OK');
  
  res.status(isHealthy ? 200 : 503).json(healthCheck);
});
```

## 🚀 Deployment

### Docker Configuration

```dockerfile
# Dockerfile for backend
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:5000
    depends_on:
      - backend

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/oldvinehotel
    depends_on:
      - mongodb

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Production Deployment

```bash
# Build and deploy script
#!/bin/bash

# Build frontend
cd client
npm run build

# Deploy to CDN (e.g., AWS S3 + CloudFront)
aws s3 sync build/ s3://hotel-website-bucket --delete
aws cloudfront create-invalidation --distribution-id ABCD1234 --paths "/*"

# Deploy backend
cd ../server

# Build Docker image
docker build -t hotel-api:latest .

# Deploy to container registry
docker tag hotel-api:latest your-registry/hotel-api:latest
docker push your-registry/hotel-api:latest

# Deploy to production environment
kubectl apply -f k8s/
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo journalctl -u mongod

# Test connection
mongo --eval "db.adminCommand('ismaster')"
```

#### API Issues
```bash
# Check API health
curl http://localhost:5000/health

# Test specific endpoint
curl -X POST http://localhost:5000/api/rooms/availability \
  -H "Content-Type: application/json" \
  -d '{"checkIn":"2024-06-01","checkOut":"2024-06-03"}'
```

#### Frontend Issues
```bash
# Clear React cache
npm start -- --reset-cache

# Check bundle size
npm run build -- --analyze

# Test production build locally
npx serve -s build
```

### Performance Debugging

```javascript
// Database query profiling
db.setProfilingLevel(2); // Profile all operations
db.system.profile.find().limit(5).sort({ts:-1}).pretty();

// API response time monitoring
const responseTime = require('response-time');
app.use(responseTime((req, res, time) => {
  logger.info('API Response Time', {
    method: req.method,
    url: req.originalUrl,
    responseTime: time,
    statusCode: res.statusCode
  });
}));
```

---

This documentation provides a comprehensive guide for developers working on The Old Vine Hotel project. For specific implementation details, refer to the code comments and individual component documentation.