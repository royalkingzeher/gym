import unittest
import requests

BASE_URL = "http://localhost:3000/api"

def test_login_success():
    payload = {
        "username": "existinguser",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/login", json=payload)
    assert response.status_code == 200
    assert "token" in response.json()

def test_login_invalid_password():
    payload = {
        "username": "existinguser",
        "password": "wrongpassword"
    }
    response = requests.post(f"{BASE_URL}/login", json=payload)
    assert response.status_code == 400
    assert response.text == "Invalid username or password."

def test_login_user_not_found():
    payload = {
        "username": "nonexistentuser",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/login", json=payload)
    assert response.status_code == 400
    assert response.text == "Invalid username or password."
