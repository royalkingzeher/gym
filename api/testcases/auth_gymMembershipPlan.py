import unittest
from unittest.mock import patch, MagicMock
import requests


BASE_URL = "http://localhost:3000/api/gymMembershipPlans"

def get_membership_plan_by_id(plan_id):
    url = f"{BASE_URL}/{plan_id}"
    response = requests.get(url)
    return response

class TestGetMembershipPlanById(unittest.TestCase):

    @patch('requests.get')
    def test_get_membership_plan_by_id_success(self, mock_get):
        plan_id = 1
        expected_response = {
            "id": 1,
            "gym_id": 1,
            "plan_name": "Basic Plan",
            "plan_description": "Access to gym facilities",
            "duration_type": "months",
            "duration_value": 12,
            "category": "standard"
        }
        
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = expected_response
        
        response = get_membership_plan_by_id(plan_id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected_response)

    @patch('requests.get')
    def test_get_membership_plan_by_id_unauthorized(self, mock_get):
        plan_id = 2
        
        mock_get.return_value.status_code = 401
        mock_get.return_value.json.return_value = {
            "error": "Unauthorized, only admin or gym_admin can fetch membership plan details."
        }
        
        response = get_membership_plan_by_id(plan_id)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {
            "error": "Unauthorized, only admin or gym_admin can fetch membership plan details."
        })

    @patch('requests.get')
    def test_get_membership_plan_by_id_not_found(self, mock_get):
        plan_id = 999  # assuming 999 is a non-existent plan ID
        
        mock_get.return_value.status_code = 404
        mock_get.return_value.json.return_value = {"error": "Membership plan not found"}
        
        response = get_membership_plan_by_id(plan_id)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"error": "Membership plan not found"})

    @patch('requests.get')
    def test_get_membership_plan_by_id_server_error(self, mock_get):
        plan_id = 3
        
        mock_get.return_value.status_code = 500
        mock_get.return_value.json.return_value = {"error": "Internal server error"}
        
        response = get_membership_plan_by_id(plan_id)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {"error": "Internal server error"})

if __name__ == "__main__":
    unittest.main()
