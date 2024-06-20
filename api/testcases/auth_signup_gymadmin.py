import unittest
import requests
import random
import string

BASE_URL = "http://localhost:3000/api"

def test_signup_gymadmin_success(auth_token):
    payload = {
        "username": "newgymadmin",
        "password": "password123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890",
        "address": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "pincode": "12345",
        "country": "USA",
        "dateOfBirth": "1990-01-01",
        "gender": "male",
        "profilePicture": "url/to/pic",
        "emergencyContactName": "Jane Doe",
        "emergencyContactRelationship": "Wife",
        "emergencyContactPhone": "0987654321",
        "emergencyContactEmail": "jane.doe@example.com"
    }
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }
    response = requests.post(f"{BASE_URL}/signup/gymadmin", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Gym admin user created successfully"

def test_signup_gymadmin_forbidden(auth_token_non_admin):
    payload = {
        "username": "newgymadmin",
        "password": "password123",
        "firstName": "John",
    }
    headers = {
        "Authorization": f"Bearer {auth_token_non_admin}"
    }
    response = requests.post(f"{BASE_URL}/signup/gymadmin", json=payload, headers=headers)
    assert response.status_code == 403
    assert response.text == "Forbidden, only admin user can create gym admin user"
