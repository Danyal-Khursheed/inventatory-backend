# IIS Deployment Guide for NestJS Backend

## Pre-Deployment Checklist

### 1. Install iisnode (if not already installed)

On your **IIS server** (not your dev machine), run as Administrator:

```powershell
# Download the iisnode installer
# For 64-bit: https://github.com/Azure/iisnode/releases/download/v0.2.26/iisnode-v0.2.26-x64.msi
# For 32-bit: https://github.com/Azure/iisnode/releases/download/v0.2.26/iisnode-v0.2.26-x86.msi

# Then verify installation:
Get-ItemProperty 'HKLM:\Software\Microsoft\IIS Extensions\iisnode' -Name Version
```

### 2. Install Node.js on IIS Server

Ensure **Node.js** is installed on the IIS server (not just your dev machine):
- Download from https://nodejs.org (LTS recommended)
- Install to default location: `C:\Program Files\nodejs\`
- Verify: `node --version` in PowerShell

### 3. Deploy to IIS

1. Copy the entire `dist/` folder contents to your IIS application directory:
   ```
   C:\inetpub\wwwroot\inventory-backend\
   ```

2. Make sure these files are present:
   - ✓ `main.js` (compiled entry point)
   - ✓ `web.config` (IIS routing configuration)
   - ✓ `package.json` (Node app manifest)
   - ✓ All module folders (auth, users, order, etc.)

### 4. Configure IIS Application

#### Create Application Pool

```powershell
# Run as Administrator
Import-Module WebAdministration

# Create app pool (if doesn't exist)
New-WebAppPool -Name "InventoryBackendPool" -Force

# Set app pool to run in Integrated Pipeline mode
$pool = Get-WebAppPool "InventoryBackendPool"
$pool.managedRuntimeVersion = ""  # No managed runtime (Node.js)
$pool.enable32BitAppCompat = $false  # 64-bit
$pool | Set-WebAppPool
```

#### Create Website/App in IIS Manager

1. **Open IIS Manager** (`inetmgr`)
2. Expand your server → Sites
3. **Create new site** OR configure existing:
   - Name: `InventoryBackend`
   - Physical Path: `C:\inetpub\wwwroot\inventory-backend`
   - Port: `4141` (or your desired port)
   - Application Pool: `InventoryBackendPool`

### 5. Set Permissions

Ensure the Application Pool identity has read/execute permissions:

```powershell
# Run as Administrator
$folderPath = "C:\inetpub\wwwroot\inventory-backend"
$identityRef = "IIS AppPool\InventoryBackendPool"

$acl = Get-Acl $folderPath
$permissions = [System.Security.AccessControl.FileSystemRights]::ReadAndExecute
$inheritanceFlags = [System.Security.AccessControl.InheritanceFlags]::ContainerInherit + [System.Security.AccessControl.InheritanceFlags]::ObjectInherit
$propagationFlags = [System.Security.AccessControl.PropagationFlags]::InheritOnly
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($identityRef, $permissions, $inheritanceFlags, $propagationFlags, [System.Security.AccessControl.AccessControlType]::Allow)
$acl.AddAccessRule($accessRule)
Set-Acl $folderPath $acl
```

### 6. Create web.config (Already Done)

The build process automatically generates `web.config` in the dist/ folder. It includes:
- ✓ iisnode handler configuration
- ✓ URL rewrite rules
- ✓ NODE_ENV=production
- ✓ PORT=8000
- ✓ Logging configuration

## Testing Deployment

### Option 1: Test via IIS Manager

1. Open IIS Manager
2. Right-click your site → Restart
3. Open your browser: `http://localhost:4141/`
   - Expected: API response (or 404 if no root route)
   - If error 500.19: Check `iisnode` logs below

### Option 2: Test via PowerShell

```powershell
Restart-WebAppPool "InventoryBackendPool"

# Wait 5 seconds
Start-Sleep -Seconds 5

# Test API endpoint
Invoke-WebRequest -Uri "http://localhost:4141/api/health" -ErrorAction SilentlyContinue
```

## Troubleshooting

### Error 500.19 - Invalid Configuration Data

**Cause**: Usually `web.config` syntax or iisnode not registered.

**Solution**:
1. Check iisnode is installed:
   ```powershell
   Get-ItemProperty 'HKLM:\Software\Microsoft\IIS Extensions\iisnode' -Name Version
   ```

2. Verify web.config syntax with IIS config validator:
   ```powershell
   & "C:\Program Files\IIS\appcmd.exe" list config "InventoryBackendPool"
   ```

3. Check Event Viewer for detailed errors:
   - Open `Event Viewer`
   - Go to Windows Logs → Application
   - Look for errors from "IIS-WebCore" or "iisnode"

### Error 404 - File Not Found

**Cause**: Missing main.js or incorrect folder structure.

**Solution**:
1. Verify `main.js` exists: `dir C:\inetpub\wwwroot\inventory-backend\main.js`
2. Verify folder contents match dist: `dir C:\inetpub\wwwroot\inventory-backend`

### App Not Starting

**Check iisnode Logs**:
```powershell
# iisnode creates logs in: C:\inetpub\wwwroot\inventory-backend\iisnode
# Once the app runs at least once
dir "C:\inetpub\wwwroot\inventory-backend\iisnode\*"

# View the latest log
Get-Content "C:\inetpub\wwwroot\inventory-backend\iisnode\main.log" -Tail 50
```

### Database Connection Issues

Verify environment variables on the IIS server. If your app uses `.env`, ensure:
1. Copy `.env` file to the deployment folder (keep it secure!)
2. Or set environment variables via Application Pool Advanced Settings

### Node.js Not Found

If you see `cannot find module or program`, ensure:
1. Node.js is installed at: `C:\Program Files\nodejs\node.exe`
2. Verify: `C:\Program Files\nodejs\node.exe --version`
3. If different path, update web.config nodeProcessCommandLine

## Environment Variables for Production

Set these in IIS Application Pool → Advanced Settings → Environment Variables:
- `PORT=8000`
- `NODE_ENV=production`
- `DB_HOST=your-db-server`
- `DB_USER=db-user`
- `DB_PASSWORD=db-password`
- `DB_NAME=database-name`

Or update the `appSettings` section in web.config.

## Monitoring & Logs

### View Real-time Logs
```powershell
# Watch iisnode logs in real-time
Get-Content -Path "C:\inetpub\wwwroot\inventory-backend\iisnode\main.log" -Wait
```

### Restart App Pool
```powershell
Restart-WebAppPool "InventoryBackendPool"
```

### Recycle All IIS
```powershell
iisreset /restart
```

---

**Generated**: 2026-02-06  
**Build Command**: `npm run build` (generates web.config and copies package.json)
