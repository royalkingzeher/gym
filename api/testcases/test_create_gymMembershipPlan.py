import unittest
from unittest.mock import patch, MagicMock
import requests

BASE_URL = "http://localhost:3000/api/gymMembershipPlans"

def create_membership_plan(data):
    url = BASE_URL
    response = requests.post(url, json=data)
    return response

class TestCreateMembershipPlan(unittest.TestCase):

    @patch('requests.post')
    def test_create_membership_plan_success(self, mock_post):
        data = {
            "gym_id": 1,
            "plan_name": "Basic Plan",
            "plan_description": "Access to gym facilities",
            "duration_type": "months",
            "duration_value": 12,
            "category": "standard"
        }
        expected_response = {
            "id": 1,
            "gym_id": 1,
            "plan_name": "Basic Plan",
            "plan_description": "Access to gym facilities",
            "duration_type": "months",
            "duration_value": 12,
            "category": "standard"
        }
        
        mock_post.return_value.status_code = 201
        mock_post.return_value.json.return_value = expected_response
        
        response = create_membership_plan(data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), expected_response)

    @patch('requests.post')
    def test_create_membership_plan_unauthorized(self, mock_post):
        data = {
            "gym_id": 1,
            "plan_name": "Basic Plan",
            "plan_description": "Access to gym facilities",
            "duration_type": "months",
            "duration_value": 12,
            "category": "standard"
        }
        
        mock_post.return_value.status_code = 401
        mock_post.return_value.json.return_value = {
            "error": "Unauthorized, only admin or gym_admin can create membership plans."
        }
        
        response = create_membership_plan(data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {
            "error": "Unauthorized, only admin or gym_admin can create membership plans."
        })

    @patch('requests.post')
    def test_create_membership_plan_gym_admin_unauthorized(self, mock_post):
        data = {
            "gym_id": 2,  # Assuming gym_admin is trying to create a plan for a different gym
            "plan_name": "Basic Plan",
            "plan_description": "Access to gym facilities",
            "duration_type": "months",
            "duration_value": 12,
            "category": "standard"
        }
        
        mock_post.return_value.status_code = 401
        mock_post.return_value.json.return_value = {
            "error": "Unauthorized, gym_admin can only create membership plans for their gym."
        }
        
        response = create_membership_plan(data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {
            "error": "Unauthorized, gym_admin can only create membership plans for their gym."
        })

    @patch('requests.post')
    def test_create_membership_plan_bad_request(self, mock_post):
        data = {
            "gym_id": 1,
            # Missing required fields like plan_name, duration_type, duration_value, category
        }
        
        mock_post.return_value.status_code = 400
        mock_post.return_value.json.return_value = {
            "error": "All required fields must be provided."
        }
        
        response = create_membership_plan(data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {
            "error": "All required fields must be provided."
        })

    @patch('requests.post')
    def test_create_membership_plan_server_error(self, mock_post):
        data = {
            "gym_id": 1,
            "plan_name": "Basic Plan",
            "plan_description": "Access to gym facilities",
            "duration_type": "months",
            "duration_value": 12,
            "category": "standard"
        }
        
        mock_post.return_value.status_code = 500
        mock_post.return_value.json.return_value = {
            "error": "Internal server error."
        }
        
        response = create_membership_plan(data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {
            "error": "Internal server error."
        })

if __name__ == "__main__":
    unittest.main()