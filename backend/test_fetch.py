import urllib.request
import urllib.parse
import json

login_data = urllib.parse.urlencode({
    "username": "hospital@healthclaim.com",
    "password": "Hospital@123"
}).encode()

req = urllib.request.Request("http://localhost:8000/api/auth/login", data=login_data)
res = urllib.request.urlopen(req)
token = json.loads(res.read())["access_token"]

req2 = urllib.request.Request("http://localhost:8000/api/claims/", headers={
    "Authorization": f"Bearer {token}"
})
try:
    res2 = urllib.request.urlopen(req2)
    print("Status:", res2.status)
    claims = json.loads(res2.read())
    print("Claims count:", len(claims))
    print("Claims:", claims)
except Exception as e:
    print("Exception:", e)
    if hasattr(e, 'read'): print(e.read().decode())
