import urllib.request
import urllib.parse
import json

login_data = urllib.parse.urlencode({
    "username": "hospital@healthclaim.com",
    "password": "Hospital@123"
}).encode()

req = urllib.request.Request("http://localhost:8000/api/auth/login", data=login_data)
try:
    res = urllib.request.urlopen(req)
    token = json.loads(res.read())["access_token"]
except Exception as e:
    print("Login failed:", e)
    if hasattr(e, 'read'): print(e.read().decode())
    exit(1)

claim_data = {
    "patient_id": 1,
    "hospital_id": 1,
    "policy_id": 1,
    "diagnosis": "Test",
    "treatment_type": "Test",
    "claim_amount": 1000,
    "treatment_date": "2026-06-08"
}
req2 = urllib.request.Request("http://localhost:8000/api/claims/", data=json.dumps(claim_data).encode(), headers={
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
})

try:
    res2 = urllib.request.urlopen(req2)
    print("Status:", res2.status)
    print("Response:", res2.read().decode())
except Exception as e:
    print("Exception:", e)
    if hasattr(e, 'read'): print(e.read().decode())
