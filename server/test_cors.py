import http.client

conn = http.client.HTTPSConnection("api.hospitaljobs.in")

headers = {
    "Origin": "https://recruiter.hospitaljobs.in",
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "Content-Type,Authorization",
}

conn.request("OPTIONS", "/your-endpoint", headers=headers)

res = conn.getresponse()
print("Status:", res.status)
print("Headers:")
for header in res.getheaders():
    print(f"{header[0]}: {header[1]}")
conn.close()
