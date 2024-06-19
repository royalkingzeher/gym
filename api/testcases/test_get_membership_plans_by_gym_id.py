import unittest
from unittest.mock import patch
import requests

BASE_URL = "http://localhost:3000/api/gymMembershipPlans"

def get_membership_plans_by_gym_id(gym_id):
    url = f"{BASE_URL}/allByGym/{gym_id}"
    response = requests.get(url)
    return response

class TestGetMembershipPlansByGymId(unittest.TestCase):

    @patch('requests.get')
    def test_get_membership_plans_by_gym_id_success(self, mock_get):
        gym_id = 1
        expected_response = [
            {
                "id": 1,
                "name": "Basic Plan",
                "price": 20,
                "duration": "3 months",
                "gym_id": gym_id
            },
            {
                "id": 2,
                "name": "Premium Plan",
                "price": 50,
                "duration": "6 months",
                "gym_id": gym_id
            }
        ]
        
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = expected_response
        
        response = get_membership_plans_by_gym_id(gym_id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected_response)

    @patch('requests.get')
    def test_get_membership_plans_by_gym_id_not_found(self, mock_get):
        gym_id = 999  # assuming 999 is a non-existent gym ID
        
        mock_get.return_value.status_code = 404
        mock_get.return_value.json.return_value = {"error": "Gym not found"}
        
        response = get_membership_plans_by_gym_id(gym_id)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"error": "Gym not found"})

    @patch('requests.get')
    def test_get_membership_plans_by_gym_id_server_error(self, mock_get):
        gym_id = 2
        
        mock_get.return_value.status_code = 500
        mock_get.return_value.json.return_value = {"error": "Internal server error"}
        
        response = get_membership_plans_by_gym_id(gym_id)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {"error": "Internal server error"})

if __name__ == "__main__":
    unittest.main()