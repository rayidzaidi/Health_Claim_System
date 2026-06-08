import urllib.request
import urllib.parse
import json

login_data = urllib.parse.urlencode({
    "username": "patient@healthclaim.com",
    "password": "Patient@123"
}).encode()

req = urllib.request.Request("http://localhost:8000/api/auth/login", data=login_data)
try:
    res = urllib.request.urlopen(req)
    token = json.loads(res.read())["access_token"]
except Exception as e:
    print("Login failed:", e)
    exit(1)

req2 = urllib.request.Request("http://localhost:8000/api/policies/", headers={
    "Authorization": f"Bearer {token}"
})
try:
    res2 = urllib.request.urlopen(req2)
    print("Status:", res2.status)
    print("Policies:", res2.read().decode())
except Exception as e:
    print("Exception:", e)
    if hasattr(e, 'read'): print(e.read().decode())
