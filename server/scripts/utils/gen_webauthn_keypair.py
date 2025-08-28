import base64

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec


def generate_webauthn_keys():
    # Generate an ECDSA P-256 private key
    private_key = ec.generate_private_key(ec.SECP256R1())

    # Serialize the private key in PKCS#8 DER format (for Playwright)
    private_key_der = private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )
    private_key_b64 = base64.b64encode(private_key_der).decode("utf-8")

    # Serialize the public key in uncompressed point format (for backend verification)
    public_key = private_key.public_key()
    public_key_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint,
    )
    # Optional: Base64 encode the public key for JSON transport
    public_key_b64 = base64.b64encode(public_key_bytes).decode("utf-8")

    return private_key_b64, public_key_bytes, public_key_b64


if __name__ == "__main__":
    priv_key_b64, pub_key_bytes, pub_key_b64 = generate_webauthn_keys()
    print("Private Key (Base64 PKCS#8 for Playwright):", priv_key_b64)
    print("Public Key (Bytes for backend):", pub_key_bytes)
    print("Public Key (Base64 for transport):", pub_key_b64)
