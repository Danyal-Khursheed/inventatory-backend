# Direct Deployment Guide - NestJS Backend (HTTP/HTTPS)

## Overview

This guide covers deploying the Inventory Management API directly without IIS, supporting both HTTP and HTTPS on Windows or Linux servers.

---

## Option 1: HTTP Only Deployment (Simplest)

### 1. Prerequisites

Ensure Node.js is installed:

```bash
node --version  # Should be v18+ (LTS recommended)
npm --version
```

### 2. Build the Project

```bash
cd c:\Users\shwra\Desktop\inventatory-backend
npm install
npm run build
```

This creates a `dist/` folder with:
- `main.js` (compiled entry point)
- `package.json` (copied from root)
- All compiled modules

### 3. Install Production Dependencies

Only needed if deploying to a server without node_modules:

```bash
cd dist
npm install --production
```

### 4. Run Directly

```bash
# HTTP on default port 8000
cd dist
node main.js

# HTTP on custom port
PORT=8000 node main.js
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════╗
║  Inventory Management API - NestJS Backend                ║
╠═══════════════════════════════════════════════════════════╣
║  Server: HTTP://localhost:8000                            ║
║  Environment: production                                  ║
║  Swagger UI: http://localhost:8000/api                    ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Option 2: HTTPS Deployment (Recommended for Production)

### Step 1: Generate SSL Certificates

#### Option A: Self-Signed Certificate (Development/Testing)

**Windows (PowerShell as Admin):**

```powershell
# Create certs folder in deployment directory
$certPath = "C:\path\to\your\dist\certs"
New-Item -ItemType Directory -Path $certPath -Force

# Generate self-signed certificate valid for 365 days
$cert = New-SelfSignedCertificate -CertStoreLocation cert:\LocalMachine\My `
  -DnsName "localhost", "your-domain.com" `
  -FriendlyName "Inventory API HTTPS" `
  -NotAfter (Get-Date).AddDays(365)

# Export certificate
$pwd = ConvertTo-SecureString -String "your-password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "$certPath\certificate.pfx" -Password $pwd

# Convert to PEM format (cert and key)
openssl pkcs12 -in "$certPath\certificate.pfx" -out "$certPath\cert.pem" -nodes -nokeys
openssl pkcs12 -in "$certPath\certificate.pfx" -out "$certPath\key.pem" -nodes -nocerts
```

**Linux/Mac (Using OpenSSL):**

```bash
# Create certs directory
mkdir -p dist/certs
cd dist/certs

# Generate private key (2048-bit RSA)
openssl genrsa -out key.pem 2048

# Generate certificate (valid for 365 days)
openssl req -new -x509 -key key.pem -out cert.pem -days 365 \
  -subj "/CN=localhost/O=Your Company/C=US"

# Verify certificate
openssl x509 -in cert.pem -text -noout
```

#### Option B: Valid Certificate (Production)

Use Let's Encrypt or your certificate provider:

```bash
# Using Certbot (for Let's Encrypt)
sudo certbot certonly --standalone -d your-domain.com

# Certificates will be at:
# /etc/letsencrypt/live/your-domain.com/fullchain.pem (cert.pem)
# /etc/letsencrypt/live/your-domain.com/privkey.pem (key.pem)
```

### Step 2: Configure HTTPS Environment Variables

Create a `.env` file in the `dist/` folder:

```env
# .env file
NODE_ENV=production
PORT=8443
USE_HTTPS=true
SERVER_HOST=localhost
HTTPS_CERT_PATH=./certs/cert.pem
HTTPS_KEY_PATH=./certs/key.pem

# Database settings
DB_HOST=your-db-server
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=inventory_db
```

### Step 3: Run with HTTPS

**Option A: Using .env File**

```bash
# Windows (PowerShell)
$env:NODE_ENV = "production"
$env:PORT = "8443"
$env:USE_HTTPS = "true"
$env:HTTPS_CERT_PATH = "./certs/cert.pem"
$env:HTTPS_KEY_PATH = "./certs/key.pem"
node main.js

# Linux/Mac (Bash)
export NODE_ENV=production
export PORT=8443
export USE_HTTPS=true
export HTTPS_CERT_PATH=./certs/cert.pem
export HTTPS_KEY_PATH=./certs/key.pem
node main.js
```

**Option B: Using Command Line Arguments**

```bash
PORT=8443 USE_HTTPS=true node main.js
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════╗
║  Inventory Management API - NestJS Backend                ║
╠═══════════════════════════════════════════════════════════╣
║  Server: HTTPS://localhost:8443                           ║
║  Environment: production                                  ║
║  Swagger UI: https://localhost:8443/api                   ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Option 3: Production Setup with PM2 (Recommended)

### 1. Install PM2 Globally

```bash
npm install -g pm2
```

### 2. Create PM2 Ecosystem File

Create `ecosystem.config.js` in the `dist/` folder:

```javascript
module.exports = {
  apps: [
    {
      name: 'inventory-api',
      script: './main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
        USE_HTTPS: 'false',
      },
      env_https: {
        NODE_ENV: 'production',
        PORT: 8443,
        USE_HTTPS: 'true',
        HTTPS_CERT_PATH: './certs/cert.pem',
        HTTPS_KEY_PATH: './certs/key.pem',
      },
      // Error and output logs
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Auto restart on crash
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      // Watch for changes (optional)
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'certs'],
    },
  ],
};
```

### 3. Start with PM2

**HTTP Only:**

```bash
cd dist
pm2 start ecosystem.config.js
```

**HTTPS (using env_https):**

```bash
cd dist
pm2 start ecosystem.config.js --env env_https
```

### 4. PM2 Management Commands

```bash
# View running apps
pm2 list

# View logs in real-time
pm2 logs

# View specific app logs
pm2 logs inventory-api

# Stop the app
pm2 stop inventory-api

# Restart the app
pm2 restart inventory-api

# Delete from PM2
pm2 delete inventory-api

# Auto-start on system reboot
pm2 startup
pm2 save
```

---

## Option 4: Windows Service (Using NSSM)

### 1. Download NSSM

Download from: https://nssm.cc/download

```powershell
# Extract and navigate to the nssm folder
cd C:\path\to\nssm\win64
```

### 2. Install Service

```powershell
# HTTP Service
.\nssm.exe install InventoryAPI-HTTP `
  "C:\Program Files\nodejs\node.exe" `
  "C:\path\to\dist\main.js"

# Set environment variables
.\nssm.exe set InventoryAPI-HTTP AppEnvironmentExtra PORT=8000`nNODE_ENV=production

# Start the service
.\nssm.exe start InventoryAPI-HTTP
```

### 3. HTTPS Service

```powershell
# HTTPS Service
.\nssm.exe install InventoryAPI-HTTPS `
  "C:\Program Files\nodejs\node.exe" `
  "C:\path\to\dist\main.js"

# Set environment variables
$env_vars = "PORT=8443`nNODE_ENV=production`nUSE_HTTPS=true`nHTTPS_CERT_PATH=./certs/cert.pem`nHTTPS_KEY_PATH=./certs/key.pem"
.\nssm.exe set InventoryAPI-HTTPS AppEnvironmentExtra $env_vars

# Start the service
.\nssm.exe start InventoryAPI-HTTPS
```

### 4. Manage Services

```powershell
# View service status
Get-Service InventoryAPI-HTTP | Format-List

# Stop service
.\nssm.exe stop InventoryAPI-HTTP

# Remove service
.\nssm.exe remove InventoryAPI-HTTP confirm
```

---

## Option 5: Docker Deployment (Advanced)

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy dist folder
COPY dist .

# Install production dependencies
RUN npm install --production

# Create certs directory
RUN mkdir -p certs

# Expose both HTTP and HTTPS ports
EXPOSE 8000 8443

# Run the app
CMD ["node", "main.js"]
```

### 2. Create .dockerignore

```
node_modules
npm-debug.log
.git
.env.local
```

### 3. Build and Run

```bash
# Build image
docker build -t inventory-api:latest .

# Run with HTTP
docker run -d -p 8000:8000 \
  -e NODE_ENV=production \
  -e PORT=8000 \
  --name inventory-api-http \
  inventory-api:latest

# Run with HTTPS (mount cert folder)
docker run -d -p 8443:8443 \
  -e NODE_ENV=production \
  -e PORT=8443 \
  -e USE_HTTPS=true \
  -e HTTPS_CERT_PATH=./certs/cert.pem \
  -e HTTPS_KEY_PATH=./certs/key.pem \
  -v /path/to/certs:/app/certs:ro \
  --name inventory-api-https \
  inventory-api:latest
```

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Set to `production` for production |
| `PORT` | 8000 | Server port |
| `USE_HTTPS` | false | Set to `true` to enable HTTPS |
| `SERVER_HOST` | localhost | Server hostname (for logging) |
| `HTTPS_CERT_PATH` | ./certs/cert.pem | Path to SSL certificate |
| `HTTPS_KEY_PATH` | ./certs/key.pem | Path to SSL private key |
| `DB_HOST` | - | Database server host |
| `DB_PORT` | - | Database server port |
| `DB_USER` | - | Database username |
| `DB_PASSWORD` | - | Database password |
| `DB_NAME` | - | Database name |

---

## Testing the API

### HTTP Endpoint

```bash
curl http://localhost:8000/api/health
```

### HTTPS Endpoint

```bash
# With self-signed certificate (ignore certificate warning)
curl -k https://localhost:8443/api/health

# Or use Postman/Insomnia and disable SSL certificate verification
```

### Swagger Documentation

- HTTP: `http://localhost:8000/api`
- HTTPS: `https://localhost:8443/api`

---

## Troubleshooting

### Certificate Errors

**Error: `ENOENT: no such file or directory, open './certs/cert.pem'`**

- Ensure `certs/cert.pem` and `certs/key.pem` exist
- Check paths match `HTTPS_CERT_PATH` and `HTTPS_KEY_PATH` env vars

**Error: `UNABLE_TO_VERIFY_LEAF_SIGNATURE` (Self-Signed)**

- Normal for self-signed certificates
- Use `curl -k` or disable SSL verification in your client

### Port Already in Use

```bash
# Windows: Find process using port 8000
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Database Connection Issues

```bash
# Test database connectivity
telnet db-server 5432

# Check environment variables
echo $DB_HOST
echo $DB_NAME
```

### View Application Logs

```bash
# PM2 logs
pm2 logs inventory-api

# Direct console output (if running in foreground)
node main.js

# Windows Event Viewer (for NSSM services)
# Event Viewer → Windows Logs → Application
```

---

## Security Checklist for Production

- [ ] Use valid SSL certificate (not self-signed)
- [ ] Set `NODE_ENV=production`
- [ ] Use strong database passwords
- [ ] Restrict database access to app server only
- [ ] Enable firewall rules (only expose 80/443)
- [ ] Use rate limiting (consider nginx/haproxy proxy)
- [ ] Enable CORS appropriately (not `*`)
- [ ] Regularly update Node.js and dependencies
- [ ] Monitor logs for errors/attacks
- [ ] Set up automated backups
- [ ] Use environment variables (never commit secrets)

---

## Next Steps

1. Choose deployment option (PM2 recommended for simplicity)
2. Generate SSL certificates for HTTPS
3. Build and test locally
4. Deploy dist/ folder to production server
5. Set environment variables
6. Start the application
7. Configure firewall/reverse proxy (optional but recommended)

---

**Questions?** Check the application logs and error messages for detailed diagnostics.
