import urllib.request
import urllib.parse
import json
import uuid

# 1. Login
login_data = urllib.parse.urlencode({
    "username": "hospital@healthclaim.com",
    "password": "Hospital@123"
}).encode()
req = urllib.request.Request("http://localhost:8000/api/auth/login", data=login_data)
try:
    res = urllib.request.urlopen(req)
    token = json.loads(res.read())["access_token"]
except Exception as e:
    print("Login failed:", getattr(e, 'read', lambda: b'()')().decode())
    exit(1)

# 2. Document Upload
boundary = uuid.uuid4().hex
body = (
    f"--{boundary}\r\n"
    f'Content-Disposition: form-data; name="file"; filename="test.txt"\r\n'
    f"Content-Type: text/plain\r\n\r\n"
    f"Hello World\r\n"
    f"--{boundary}--\r\n"
).encode()

req2 = urllib.request.Request(
    "http://localhost:8000/api/claims/5/documents", 
    data=body, 
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": f"multipart/form-data; boundary={boundary}"
    }
)

try:
    res2 = urllib.request.urlopen(req2)
    print("Status:", res2.status)
    print("Response:", res2.read().decode())
except Exception as e:
    print("Upload failed:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
