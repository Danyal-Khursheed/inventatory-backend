#!/usr/bin/env python3
"""
Generate a self-signed certificate for HTTPS development.
Requires Python 3.6+. Install cryptography if needed:
  pip install cryptography
"""

import os
import sys
from pathlib import Path
from datetime import datetime, timedelta, timezone
import ipaddress

try:
    from cryptography import x509
    from cryptography.x509.oid import NameOID, ExtensionOID
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.backends import default_backend
    from cryptography.hazmat.primitives.asymmetric import rsa
except ImportError:
    print("Error: cryptography module not found.")
    print("Install it with: pip install cryptography")
    sys.exit(1)


def generate_cert(cert_dir="certs", cert_name="localhost"):
    """Generate a self-signed certificate for localhost."""
    cert_path = Path(cert_dir) / "cert.pem"
    key_path = Path(cert_dir) / "key.pem"

    # Check if cert already exists
    if cert_path.exists() and key_path.exists():
        print(f"Certificate and key already exist in {cert_dir}")
        return True

    # Create certs directory
    Path(cert_dir).mkdir(exist_ok=True, parents=True)

    print(f"Generating self-signed certificate for {cert_name}...")

    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend(),
    )

    # Generate certificate
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, cert_name),
    ])

    cert = x509.CertificateBuilder().subject_name(
        subject
    ).issuer_name(
        issuer
    ).public_key(
        private_key.public_key()
    ).serial_number(
        x509.random_serial_number()
    ).not_valid_before(
        datetime.now(timezone.utc)
    ).not_valid_after(
        datetime.now(timezone.utc) + timedelta(days=365)
    ).add_extension(
        x509.SubjectAlternativeName([
            x509.DNSName(cert_name),
            x509.DNSName("127.0.0.1"),
            x509.IPAddress(ipaddress.IPv4Address("127.0.0.1")),
        ]),
        critical=False,
    ).add_extension(
        x509.KeyUsage(
            digital_signature=True,
            content_commitment=False,
            key_encipherment=True,
            data_encipherment=False,
            key_agreement=False,
            key_cert_sign=False,
            crl_sign=False,
            encipher_only=False,
            decipher_only=False,
        ),
        critical=True,
    ).add_extension(
        x509.ExtendedKeyUsage([
            x509.oid.ExtendedKeyUsageOID.SERVER_AUTH,
        ]),
        critical=False,
    ).sign(
        private_key,
        hashes.SHA256(),
        default_backend()
    )

    # Write private key
    with open(key_path, "wb") as f:
        f.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption(),
        ))

    # Write certificate
    with open(cert_path, "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))

    print("")
    print("✓ Self-signed certificate generated successfully!")
    print(f"  Key:  {key_path}")
    print(f"  Cert: {cert_path}")
    print("")
    print("⚠ WARNING: This is a self-signed certificate.")
    print("  Your browser will show a security warning - this is normal for development.")
    print("")
    return True


if __name__ == "__main__":
    success = generate_cert()
    sys.exit(0 if success else 1)
