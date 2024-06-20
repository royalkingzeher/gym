import unittest
import requests

BASE_URL = "http://localhost:3000/api"

class TestMembershipPlanAPI(unittest.TestCase):
    
    def setUp(self):
        self.auth_token = "your_auth_token_here"
        self.headers = {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json"
        }

    def test_create_membership_plan_success(self):
        payload = {
            "name": "Basic Plan",
            "description": "Access to gym facilities",
            "price": 49.99,
            "duration": 30  # Duration in days
        }
        response = requests.post(f"{BASE_URL}/membershipPlan", json=payload, headers=self.headers)
        self.assertEqual(response.status_code, 201)
        try:
            response_json = response.json()
            self.assertEqual(response_json["message"], "Membership plan created successfully")
        except ValueError:
            self.fail("Response is not in JSON format")

    def test_create_membership_plan_missing_name(self):
        payload = {
            "description": "Access to gym facilities",
            "price": 49.99,
            "duration": 30
        }
        response = requests.post(f"{BASE_URL}/membershipPlan", json=payload, headers=self.headers)
        self.assertEqual(response.status_code, 400)
        try:
            response_json = response.json()
            self.assertIn("error", response_json)
            self.assertEqual(response_json["error"], "Name is required.")
        except ValueError:
            self.fail("Response is not in JSON format")

    def test_api_response(self):
        response = requests.get("http://localhost:3000/api/endpoint")
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
