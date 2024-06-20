import unittest
import requests

BASE_URL = "http://localhost:3000/api"

def test_create_membership_plan_success(auth_token):
    payload = {
        "name": "Basic Plan",
        "description": "Access to gym facilities",
        "price": 49.99,
        "duration": 30  # Duration in days
    }
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }
    response = requests.post(f"{BASE_URL}/membershipPlan", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Membership plan created successfully"

def test_create_membership_plan_missing_name(auth_token):
    payload = {
        "description": "Access to gym facilities",
        "price": 49.99,
        "duration": 30
    }
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }
    response = requests.post(f"{BASE_URL}/membershipPlan", json=payload, headers=headers)
    assert response.status_code == 400
    assert response.text == "Name is required."
