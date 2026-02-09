# PowerShell script to generate a self-signed certificate for HTTPS development
# Usage: powershell -ExecutionPolicy Bypass -File scripts/generate-certs.ps1

$certsDir = "certs"
$certName = "localhost"
$keyFile = "$certsDir/key.pem"
$certFile = "$certsDir/cert.pem"

# Create certs directory if it doesn't exist
if (-not (Test-Path $certsDir)) {
    New-Item -ItemType Directory -Path $certsDir | Out-Null
    Write-Host "Created $certsDir directory"
}

# Check if cert already exists
if ((Test-Path $certFile) -and (Test-Path $keyFile)) {
    Write-Host "Certificate and key already exist in $certsDir"
    exit 0
}

# Generate self-signed certificate using PowerShell
Write-Host "Generating self-signed certificate..."
$cert = New-SelfSignedCertificate `
    -DnsName "localhost", "127.0.0.1" `
    -FriendlyName "Inventory Management Dev Certificate" `
    -CertStoreLocation cert:\CurrentUser\My `
    -NotAfter (Get-Date).AddYears(1) `
    -KeyUsage DigitalSignature, KeyEncipherment `
    -ExtendedKeyUsage "1.3.6.1.5.5.7.3.1"

Write-Host "Certificate generated: $($cert.Thumbprint)"

# Export to PFX format
$tempPfx = "$certsDir/temp.pfx"
$tempPassword = "temp_export_password"
$securePassword = ConvertTo-SecureString -String $tempPassword -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath $tempPfx -Password $securePassword -Force | Out-Null
Write-Host "Exported to PFX: $tempPfx"

# Check if OpenSSL is available
$openssl = Get-Command openssl -ErrorAction SilentlyContinue

if ($null -ne $openssl) {
    Write-Host "OpenSSL found - converting to PEM..."
    openssl pkcs12 -in $tempPfx -out "$certFile" -nodes -password pass:$tempPassword -nokeys 2>$null
    openssl pkcs12 -in $tempPfx -out "$keyFile" -nodes -password pass:$tempPassword -nocerts 2>$null
    
    if ((Test-Path $certFile) -and (Test-Path $keyFile)) {
        Remove-Item $tempPfx -Force
        Write-Host ""
        Write-Host "Self-signed certificate generated successfully!"
        Write-Host "Key:  $keyFile"
        Write-Host "Cert: $certFile"
        Write-Host ""
        Write-Host "WARNING: This is a self-signed certificate."
        Write-Host "Your browser will show a security warning - this is normal for development."
        exit 0
    }
}

Write-Host ""
Write-Host "OpenSSL not found - installing via chocolatey..."
# Try to install OpenSSL via chocolatey
$chocoCheck = Get-Command choco -ErrorAction SilentlyContinue
if ($null -ne $chocoCheck) {
    Write-Host "Installing openssl..."
    choco install openssl -y
    
    Write-Host "Converting to PEM..."
    openssl pkcs12 -in $tempPfx -out "$certFile" -nodes -password pass:$tempPassword -nokeys
    openssl pkcs12 -in $tempPfx -out "$keyFile" -nodes -password pass:$tempPassword -nocerts
    
    if ((Test-Path $certFile) -and (Test-Path $keyFile)) {
        Remove-Item $tempPfx -Force
        Write-Host ""
        Write-Host "Self-signed certificate generated successfully!"
        Write-Host "Key:  $keyFile"
        Write-Host "Cert: $certFile"
        exit 0
    }
} else {
    Write-Host "Chocolatey not found. Please install OpenSSL manually:"
    Write-Host "  - https://slproweb.com/products/Win32OpenSSL.html"
    Write-Host "  - OR: choco install openssl"
    Write-Host ""
    Write-Host "Certificate Thumbprint: $($cert.Thumbprint)"
    Write-Host "Stored in: Cert:\CurrentUser\My"
    exit 1
}
