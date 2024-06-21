import unittest
from unittest.mock import patch
import requests

BASE_URL = "http://localhost:3000/api/gymMembershipPlans/update"

def update_membership_plan(plan_id, data):
    url = f"{BASE_URL}/update/{plan_id}"
    response = requests.put(url, json=data)
    return response

class TestUpdateMembershipPlan(unittest.TestCase):

    @patch('requests.put')
    def test_update_membership_plan_success(self, mock_put):
        plan_id = 1
        data = {
            "name": "Premium Plan",
            "price": 50,
            "duration": "6 months"
        }
        
        mock_put.return_value.status_code = 200
        mock_put.return_value.json.return_value = {
            "name": "Premium Plan",
            "price": 50,
            "duration": "6 months"
        }
        
        response = update_membership_plan(plan_id, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            "name": "Premium Plan",
            "price": 50,
            "duration": "6 months"
        })

    @patch('requests.put')
    def test_update_membership_plan_not_found(self, mock_put):
        plan_id = 999  # assuming 999 is a non-existent plan ID
        data = {
            "name": "Non-Existent Plan",
            "price": 100,
            "duration": "12 months"
        }
        
        mock_put.return_value.status_code = 404
        mock_put.return_value.json.return_value = {"error": "Membership plan not found"}
        
        response = update_membership_plan(plan_id, data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"error": "Membership plan not found"})

    @patch('requests.put')
    def test_update_membership_plan_unauthorized(self, mock_put):
        plan_id = 2
        data = {
            "name": "Basic Plan",
            "price": 20,
            "duration": "3 months"
        }
        
        mock_put.return_value.status_code = 401
        mock_put.return_value.json.return_value = {"error": "Unauthorized, only admin or gym_admin can update membership plans"}
        
        response = update_membership_plan(plan_id, data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"error": "Unauthorized, only admin or gym_admin can update membership plans"})

    @patch('requests.put')
    def test_update_membership_plan_bad_request(self, mock_put):
        plan_id = 3
        data = {}  # sending an empty body
        
        mock_put.return_value.status_code = 400
        mock_put.return_value.json.return_value = {"error": "Bad request"}
        
        response = update_membership_plan(plan_id, data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"error": "Bad request"})

    @patch('requests.put')
    def test_update_membership_plan_server_error(self, mock_put):
        plan_id = 4
        data = {
            "name": "Gold Plan",
            "price": 70,
            "duration": "12 months"
        }
        
        mock_put.return_value.status_code = 500
        mock_put.return_value.json.return_value = {"error": "Internal server error"}
        
        response = update_membership_plan(plan_id, data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {"error": "Internal server error"})

if __name__ == "__main__":
    unittest.main()
