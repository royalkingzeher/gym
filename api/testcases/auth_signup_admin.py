import unittest
import requests
import random
import string

BASE_URL = "http://localhost:3000/api"

def test_signup_admin_success():
    payload = {
        "username": "newadmin",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/signup/admin", json=payload)
    assert response.status_code == 200
    assert response.json()["message"] == "Admin user created successfully"

def test_signup_admin_existing_user():
    payload = {
        "username": "existingadmin",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/signup/admin", json=payload)
    assert response.status_code == 400
    assert response.text == "User already exists."

def test_signup_admin_invalid_password():
    payload = {
        "username": "newadmin",
        "password": "short"
    }
    response = requests.post(f"{BASE_URL}/signup/admin", json=payload)
    assert response.status_code == 400
    assert response.text == "Password must be at least 8 characters long."
