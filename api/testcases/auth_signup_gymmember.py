import unittest
import requests
import random
import string

BASE_URL = "http://localhost:3000/api"

def test_signup_gymmember_success(auth_token):
    payload = {
        "username": "newgymmember",
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
        "emergencyContactEmail": "jane.doe@example.com",
        "gymId": 1
    }
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }
    response = requests.post(f"{BASE_URL}/signup/gymmember", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Gym member user created successfully"

def test_signup_gymmember_invalid_gym_id(auth_token):
    payload = {
        "username": "newgymmember",
        "password": "password123",
        "firstName": "John",
        "gymId": 999  # Assuming 999 does not exist
    }
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }
    response = requests.post(f"{BASE_URL}/signup/gymmember", json=payload, headers=headers)
    assert response.status_code == 400
    assert response.text == "Gym does not exist."
