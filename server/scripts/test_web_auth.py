import base64

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec

# Generate a new EC key pair
private_key = ec.generate_private_key(ec.SECP256R1())
public_key = private_key.public_key()

# Export private key (PKCS8 format)
private_key_bytes = private_key.private_bytes(
    encoding=serialization.Encoding.DER,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption(),
)

# Export public key (SubjectPublicKeyInfo format)
public_key_bytes = public_key.public_bytes(
    encoding=serialization.Encoding.DER,
    format=serialization.PublicFormat.SubjectPublicKeyInfo,
)

# Base64 encode keys
private_key_base64 = base64.b64encode(private_key_bytes).decode("utf-8")
public_key_base64 = base64.b64encode(public_key_bytes).decode("utf-8")

print("✅ Private Key (Bytes):", private_key_bytes)
print("✅ Private Key (Base64):", private_key_base64)
print("✅ Public Key (Bytes):", public_key_bytes)
print("✅ Public Key (Base64):", public_key_base64)
