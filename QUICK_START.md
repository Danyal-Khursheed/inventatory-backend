# Quick Start Guide - HTTP/HTTPS Deployment

## ✅ Setup Complete

Your NestJS backend is now ready for deployment without IIS, supporting both HTTP and HTTPS.

---

## 🚀 Quick Start (HTTP Only)

### 1. Build the Project
```bash
npm run build
```

This automatically:
- ✓ Compiles TypeScript → dist/
- ✓ Copies .env file
- ✓ Copies package.json
- ✓ Creates web.config (only if GENERATE_WEB_CONFIG=true)

### 2. Run the App
```bash
cd dist
node main.js
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════╗
║  Inventory Management API - NestJS Backend                ║
╠═══════════════════════════════════════════════════════════╣
║  Server: HTTP://localhost:8000                            ║
║  Environment: development                                ║
║  Swagger UI: http://localhost:8000/api                   ║
╚═══════════════════════════════════════════════════════════╝
```

### 3. Test the API
```bash
# Swagger Documentation
http://localhost:8000/api

# Or test with curl
curl http://localhost:8000/api/warehouses/get-all-warehouses
```

---

## 🔐 HTTPS Deployment (Production)

### Step 1: Generate SSL Certificates

**Windows (PowerShell as Admin):**
```powershell
# Create certs directory in dist
mkdir dist\certs

# Generate self-signed certificate
$cert = New-SelfSignedCertificate -CertStoreLocation cert:\LocalMachine\My `
  -DnsName "localhost" -FriendlyName "Inventory API HTTPS" `
  -NotAfter (Get-Date).AddDays(365)

# Export to PEM format
$pwd = ConvertTo-SecureString -String "password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "dist\certs\certificate.pfx" -Password $pwd

# Convert to PEM (requires OpenSSL)
openssl pkcs12 -in dist\certs\certificate.pfx -out dist\certs\cert.pem -nodes -nokeys
openssl pkcs12 -in dist\certs\certificate.pfx -out dist\certs\key.pem -nodes -nocerts
```

**Linux/Mac:**
```bash
mkdir -p dist/certs
cd dist/certs

# Generate certificate (valid 365 days)
openssl genrsa -out key.pem 2048
openssl req -new -x509 -key key.pem -out cert.pem -days 365 \
  -subj "/CN=localhost/O=Company/C=US"
```

### Step 2: Create .env in dist folder

Copy your `.env` file to `dist/.env` (build script does this automatically).

### Step 3: Run with HTTPS

**Windows (PowerShell):**
```powershell
cd dist
$env:USE_HTTPS = "true"
$env:PORT = "8443"
node main.js
```

**Linux/Mac (Bash):**
```bash
cd dist
export USE_HTTPS=true
export PORT=8443
node main.js
```

**Expected Output:**
```
║  Server: HTTPS://localhost:8443                           ║
║  Swagger UI: https://localhost:8443/api                  ║
```

---

## 📦 Production Deployment with PM2

### 1. Install PM2
```bash
npm install -g pm2
```

### 2. Copy ecosystem.config.js to dist
```bash
# Already done during build, but if needed:
cp ecosystem.config.js dist/
```

### 3. Start HTTP Only
```bash
cd dist
pm2 start ecosystem.config.js
```

### 4. Start HTTPS
```bash
cd dist
pm2 start ecosystem.config.js --env env_https
```

### 5. Monitor
```bash
pm2 list              # View all apps
pm2 logs             # Real-time logs
pm2 restart all      # Restart all
pm2 stop all         # Stop all
```

### 6. Auto-start on System Reboot
```bash
pm2 startup
pm2 save
```

---

## 📋 File Structure

```
dist/
├── main.js                 # Entry point
├── package.json            # Dependencies manifest
├── .env                    # Environment variables (auto-copied)
├── ecosystem.config.js     # PM2 configuration
├── web.config              # IIS config (only if GENERATE_WEB_CONFIG=true)
├── certs/                  # SSL certificates (for HTTPS)
│   ├── cert.pem
│   └── key.pem
└── [all compiled modules]
```

---

## 🔧 Environment Variables

The following are set in your `.env`:
```env
DB_HOST=localhost
DB_PORT=9123
DB_NAME=Inventory-Managment
DB_USER=postgres
DB_PASSWORD=SuperAdmin@123
JWT_SECRET=this_is_jwt_secret
```

Add these for HTTPS:
```env
USE_HTTPS=true
PORT=8443
HTTPS_CERT_PATH=./certs/cert.pem
HTTPS_KEY_PATH=./certs/key.pem
```

---

## ✨ Features

✅ HTTP support (port 8000 default)
✅ HTTPS support with custom certificates
✅ Auto-reload with PM2
✅ Automatic .env configuration
✅ Multi-instance clustering (PM2)
✅ Real-time logging
✅ Swagger/OpenAPI documentation
✅ Graceful shutdown
✅ Built-in CORS

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Certificate Errors
Ensure `certs/cert.pem` and `certs/key.pem` exist in dist folder.

### Database Connection Issues
- Verify `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in `.env`
- Ensure database server is running: `psql -h localhost -U postgres`

### App Crashes
```bash
# Check PM2 logs
pm2 logs inventory-api

# View error details
pm2 show inventory-api
```

---

## 📞 Common Commands

```bash
# Development (with auto-reload)
npm run start:dev

# Production build
npm run build

# Run compiled app
cd dist && node main.js

# Run with PM2 (HTTP)
pm2 start ecosystem.config.js

# Run with PM2 (HTTPS)
pm2 start ecosystem.config.js --env env_https

# View logs
pm2 logs

# Restart app
pm2 restart inventory-api

# Stop app
pm2 stop inventory-api

# Delete from PM2
pm2 delete inventory-api
```

---

## 🎯 Next Steps

1. ✅ Build: `npm run build`
2. ✅ Test Locally: `cd dist && node main.js`
3. ✅ Deploy to Server: Copy `dist/` folder
4. ✅ Set Environment Variables: Update `.env`
5. ✅ Start with PM2: `pm2 start ecosystem.config.js`
6. ✅ Monitor: `pm2 logs`

---

**Deployment is ready! Your API is running on HTTP. For HTTPS, follow the certificate generation steps above.**
