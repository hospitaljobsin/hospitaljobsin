import base64

import bson

user_id = bson.ObjectId("60f1b9b3b3b3b3b3b3b3b3b3")
user_handle_bytes = user_id.binary

# Convert to Base64 (padded)
user_handle_base64 = base64.b64encode(user_handle_bytes).decode("utf-8")

print("✅ User Handle (Bytes):", user_handle_bytes)
print("✅ User Handle (Base64):", user_handle_base64)
