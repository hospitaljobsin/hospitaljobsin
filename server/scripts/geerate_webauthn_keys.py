import base64

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec


def generate_webauthn_keys():
    # Generate an ECDSA P-256 private key
    private_key = ec.generate_private_key(ec.SECP256R1())

    # Serialize the private key in PKCS#8 DER format
    private_key_der = private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )

    # Encode the DER bytes as a base64 string for JSON transport
    private_key_b64 = base64.b64encode(private_key_der).decode("utf-8")

    # Obtain the public key and serialize it in uncompressed point format (bytes)
    public_key = private_key.public_key()
    public_key_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint,
    )

    return private_key_b64, public_key_bytes


if __name__ == "__main__":
    priv_key_b64, pub_key_bytes = generate_webauthn_keys()
    print("Private Key (Base64 PKCS#8):", priv_key_b64)
    print("Public Key (Bytes):", pub_key_bytes)
