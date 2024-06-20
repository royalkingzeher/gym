import unittest
import requests

BASE_URL = "http://localhost:3000/api"

def test_user_details_success(auth_token):
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }
    response = requests.post(f"{BASE_URL}/userDetails", headers=headers)
    assert response.status_code == 200
    assert "username" in response.json()

def test_user_details_unauthorized():
    response = requests.post(f"{BASE_URL}/userDetails")
    assert response.status_code == 401
    assert response.text == "Unauthorized"
