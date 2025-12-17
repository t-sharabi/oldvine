# Deployment Guide - The Old Vine Hotel

## 🚀 Production Deployment

This guide covers deploying The Old Vine Hotel website to production environments.

## 🏗️ Infrastructure Requirements

### Minimum Server Specifications

**Backend Server:**
- CPU: 2 vCPUs
- RAM: 4GB
- Storage: 50GB SSD
- OS: Ubuntu 20.04 LTS or CentOS 8

**Database Server:**
- CPU: 2 vCPUs
- RAM: 4GB
- Storage: 100GB SSD
- MongoDB 5.0+

**Recommended for High Traffic:**
- Load Balancer (nginx)
- Redis for caching
- CDN for static assets
- Multiple application instances

## 🐳 Docker Deployment (Recommended)

### 1. Build Production Images

```bash
# Clone repository
git clone <your-repo-url>
cd old-vine-hotel-website

# Build frontend
cd client
npm install
npm run build

# Build backend
cd ../server
npm install
```

### 2. Docker Configuration

**Frontend Dockerfile:**
```dockerfile
# client/Dockerfile
FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**
```dockerfile
# server/Dockerfile
FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["npm", "start"]
```

### 3. Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    restart: unless-stopped

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    env_file:
      - .env.production
    volumes:
      - ./logs:/app/logs
    depends_on:
      - mongodb
      - redis
    restart: unless-stopped

  mongodb:
    image: mongo:5.0
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
      - MONGO_INITDB_DATABASE=oldvinehotel
    volumes:
      - mongodb_data:/data/db
      - ./mongodb/mongod.conf:/etc/mongod.conf:ro
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mongodb_data:
  redis_data:
```

### 4. Nginx Configuration

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }

    upstream frontend {
        server frontend:80;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # SSL Configuration
    server {
        listen 80;
        server_name oldvinehotel.com www.oldvinehotel.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name oldvinehotel.com www.oldvinehotel.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Auth routes with stricter limits
        location /api/auth/login {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://backend;
        }

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Static files caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, no-transform";
            proxy_pass http://frontend;
        }
    }
}
```

### 5. Environment Configuration

```bash
# .env.production
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://admin:secure_password@mongodb:27017/oldvinehotel?authSource=admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_password

# Security
JWT_SECRET=your_super_secure_jwt_secret_key_for_production
JWT_EXPIRES_IN=7d

# External APIs
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
GOOGLE_MAPS_API_KEY=your_production_maps_key

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
EMAIL_FROM=noreply@oldvinehotel.com

# Hotel Information
HOTEL_NAME=The Old Vine Hotel
HOTEL_ADDRESS=123 Luxury Avenue, Downtown District, City, State 12345
HOTEL_PHONE=+1 (555) 123-4567
HOTEL_EMAIL=info@oldvinehotel.com

# Integration APIs
OPERA_PMS_URL=https://your-opera-pms.com/api
OPERA_PMS_USERNAME=production_user
OPERA_PMS_PASSWORD=production_password

BOOKING_COM_API_URL=https://distribution-xml.booking.com
BOOKING_COM_USERNAME=your_booking_username
BOOKING_COM_PASSWORD=your_booking_password

# Redis
REDIS_URL=redis://redis:6379

# Logging
LOG_LEVEL=info
```

### 6. Deploy with Docker Compose

```bash
# Create production environment file
cp .env.example .env.production
# Edit .env.production with your production values

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

## ☁️ Cloud Deployment Options

### AWS Deployment

#### Using AWS ECS

```bash
# Install AWS CLI and ECS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure

# Create ECS cluster
aws ecs create-cluster --cluster-name old-vine-hotel

# Create task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create service
aws ecs create-service \
  --cluster old-vine-hotel \
  --service-name hotel-website \
  --task-definition hotel-website:1 \
  --desired-count 2
```

#### ECS Task Definition

```json
{
  "family": "hotel-website",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "hotel-backend",
      "image": "your-account.dkr.ecr.us-east-1.amazonaws.com/hotel-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:account:secret:hotel/mongodb-uri"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/hotel-website",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Platform

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Create GKE cluster
gcloud container clusters create hotel-cluster \
  --num-nodes=3 \
  --zone=us-central1-a

# Build and push images
gcloud builds submit --tag gcr.io/PROJECT_ID/hotel-backend ./server
gcloud builds submit --tag gcr.io/PROJECT_ID/hotel-frontend ./client

# Deploy to GKE
kubectl apply -f k8s/
```

### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: old-vine-hotel
services:
- name: backend
  source_dir: /server
  github:
    repo: your-username/old-vine-hotel
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 2
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${DB_CONNECTION_STRING}
    type: SECRET

- name: frontend
  source_dir: /client
  github:
    repo: your-username/old-vine-hotel
    branch: main
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /

databases:
- name: hotel-db
  engine: MONGODB
  version: "5"
```

## 🔧 Manual Server Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install PM2 for process management
npm install -g pm2

# Install nginx
sudo apt install nginx
```

### 2. Application Deployment

```bash
# Clone repository
git clone <your-repo-url> /var/www/hotel
cd /var/www/hotel

# Install backend dependencies
cd server
npm install --production

# Install frontend dependencies and build
cd ../client
npm install
npm run build

# Copy build to nginx directory
sudo cp -r build/* /var/www/html/
```

### 3. PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'hotel-backend',
      script: './server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
```

```bash
# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### 4. Nginx Configuration

```nginx
# /etc/nginx/sites-available/hotel
server {
    listen 80;
    server_name oldvinehotel.com www.oldvinehotel.com;
    root /var/www/html;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hotel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔐 SSL Certificate Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d oldvinehotel.com -d www.oldvinehotel.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### Manual SSL Certificate

```nginx
# Add to nginx configuration
server {
    listen 443 ssl http2;
    server_name oldvinehotel.com;
    
    ssl_certificate /etc/ssl/certs/oldvinehotel.com.crt;
    ssl_certificate_key /etc/ssl/private/oldvinehotel.com.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # ... rest of configuration
}
```

## 📊 Monitoring Setup

### Application Monitoring

```bash
# Install monitoring tools
npm install -g clinic
npm install newrelic

# Setup log rotation
sudo nano /etc/logrotate.d/hotel
```

```
# /etc/logrotate.d/hotel
/var/www/hotel/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload hotel-backend
    endscript
}
```

### Database Monitoring

```bash
# Enable MongoDB profiler
mongo
use oldvinehotel
db.setProfilingLevel(1, { slowms: 100 })

# Setup monitoring script
crontab -e
```

```bash
# Monitor disk space every hour
0 * * * * /usr/local/bin/check-disk-space.sh

# Backup database daily at 2 AM
0 2 * * * /usr/local/bin/backup-mongodb.sh
```

## 🔄 Backup Strategy

### Database Backup

```bash
#!/bin/bash
# backup-mongodb.sh

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/mongodb"
DB_NAME="oldvinehotel"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# Compress backup
tar -czf $BACKUP_DIR/mongodb_backup_$DATE.tar.gz -C $BACKUP_DIR $DATE

# Remove uncompressed backup
rm -rf $BACKUP_DIR/$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR/mongodb_backup_$DATE.tar.gz s3://hotel-backups/
```

### Application Backup

```bash
#!/bin/bash
# backup-application.sh

DATE=$(date +"%Y%m%d_%H%M%S")
APP_DIR="/var/www/hotel"
BACKUP_DIR="/backups/application"

# Create backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="logs" \
    $APP_DIR

# Keep only last 3 backups
ls -t $BACKUP_DIR/app_backup_*.tar.gz | tail -n +4 | xargs rm -f
```

## 🚨 Disaster Recovery

### Recovery Procedures

```bash
# Database Recovery
mongorestore --db oldvinehotel /path/to/backup/oldvinehotel

# Application Recovery
cd /var/www
tar -xzf /backups/application/app_backup_YYYYMMDD_HHMMSS.tar.gz
sudo chown -R www-data:www-data hotel

# Restart services
pm2 restart all
sudo systemctl restart nginx
```

### Health Check Automation

```bash
#!/bin/bash
# health-check.sh

# Check API health
if ! curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "API health check failed" | mail -s "Hotel API Down" admin@oldvinehotel.com
    pm2 restart hotel-backend
fi

# Check database connection
if ! mongo --eval "db.adminCommand('ismaster')" > /dev/null 2>&1; then
    echo "Database connection failed" | mail -s "Hotel DB Down" admin@oldvinehotel.com
    sudo systemctl restart mongod
fi

# Check disk space
USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $USAGE -gt 80 ]; then
    echo "Disk usage is at $USAGE%" | mail -s "High Disk Usage" admin@oldvinehotel.com
fi
```

## 📈 Performance Optimization

### Database Optimization

```bash
# MongoDB configuration
# /etc/mongod.conf
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2
    collectionConfig:
      blockCompressor: snappy

net:
  bindIp: 127.0.0.1
  port: 27017
  maxIncomingConnections: 100

operationProfiling:
  slowOpThresholdMs: 100
  mode: slowOp
```

### Application Optimization

```javascript
// Add to server configuration
const compression = require('compression');
const helmet = require('helmet');

app.use(compression());
app.use(helmet());

// Connection pooling
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

## 🔍 Troubleshooting

### Common Issues

```bash
# Check application logs
pm2 logs hotel-backend

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Check system resources
top
df -h
free -h
```

### Performance Issues

```bash
# Monitor database performance
mongo
db.currentOp()
db.serverStatus()

# Check slow queries
db.system.profile.find().limit(5).sort({ts:-1}).pretty()

# Monitor Node.js performance
node --inspect server/index.js
# Then open chrome://inspect
```

This deployment guide provides comprehensive instructions for deploying The Old Vine Hotel website in production environments. Choose the deployment method that best fits your infrastructure and requirements.