const fs = require('fs');
const path = require('path');

// Always generate a production-ready web.config for IIS + ARR reverse-proxy
const content = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <clear />
        <rule name="ReverseProxyToNode" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="http://localhost:3000/{R:1}" />
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <add segment="node_modules" />
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
`;

const outPath = path.join(__dirname, '..', 'dist', 'web.config');
const body = Buffer.from(content.replace(/\n/g, '\r\n'), 'utf8');
try {
  fs.mkdirSync(path.join(__dirname, '..', 'dist'), { recursive: true });
  fs.writeFileSync(outPath, body);
  console.log('✓ web.config written to dist/ (ARR reverse-proxy to http://localhost:3000)');
} catch (err) {
  console.warn('⚠ Could not write web.config to dist/:', err.message);
}

// Copy package.json to dist (always needed)
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const distPackageJsonPath = path.join(__dirname, '..', 'dist', 'package.json');

try {
  const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
  fs.writeFileSync(distPackageJsonPath, packageJson);
  console.log('✓ package.json copied to dist/');
} catch (err) {
  console.warn('⚠ Could not copy package.json:', err.message);
}

// Ensure dist/.env exists and contains NODE_ENV=production, PORT, and HTTPS settings
const envPath = path.join(__dirname, '..', '.env');
const distEnvPath = path.join(__dirname, '..', 'dist', '.env');
const certsDir = path.join(__dirname, '..', 'certs');
try {
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  const lines = envContent.split(/\r?\n/).filter(Boolean);
  const map = new Map();
  lines.forEach(line => {
    const idx = line.indexOf('=');
    if (idx > -1) {
      const k = line.substring(0, idx).trim();
      const v = line.substring(idx + 1).trim();
      map.set(k, v);
    }
  });

  // Ensure production environment
  map.set('NODE_ENV', 'production');
  
  // Set default port for HTTPS development (449) or keep PORT if set
  if (!map.has('PORT')) map.set('PORT', '449');
  
  // Set HTTPS support for development/testing (disabled by default in production)
  // To enable HTTPS, set USE_HTTPS=true and ensure certs are in ./certs/
  if (!map.has('USE_HTTPS')) map.set('USE_HTTPS', 'false');
  if (!map.has('HTTPS_CERT_PATH')) map.set('HTTPS_CERT_PATH', './certs/cert.pem');
  if (!map.has('HTTPS_KEY_PATH')) map.set('HTTPS_KEY_PATH', './certs/key.pem');

  const outEnv = Array.from(map.entries()).map(([k, v]) => `${k}=${v}`).join('\r\n') + '\r\n';
  fs.writeFileSync(distEnvPath, outEnv, 'utf8');
  console.log('✓ dist/.env written (ensured NODE_ENV=production, PORT=449, HTTPS settings)');
} catch (err) {
  console.warn('⚠ Could not ensure dist/.env:', err.message);
}

// Copy certs directory to dist if it exists
const distCertsDir = path.join(__dirname, '..', 'dist', 'certs');
try {
  if (fs.existsSync(certsDir)) {
    fs.mkdirSync(distCertsDir, { recursive: true });
    const files = fs.readdirSync(certsDir);
    files.forEach(file => {
      const src = path.join(certsDir, file);
      const dst = path.join(distCertsDir, file);
      if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dst);
      }
    });
    console.log('✓ certs/ copied to dist/certs/');
  }
} catch (err) {
  console.warn('⚠ Could not copy certs:', err.message);
}

console.log(`
✓ Build complete
  To run with HTTPS on https://localhost:449/:
    1. Generate certificates: powershell -ExecutionPolicy Bypass -File scripts/generate-certs.ps1
    2. Set USE_HTTPS=true in dist/.env
    3. Run: npm run start:prod
`);
