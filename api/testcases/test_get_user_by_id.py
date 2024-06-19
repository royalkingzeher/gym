import unittest
from unittest.mock import patch
import requests

BASE_URL = "http://localhost:3000/api/users"

def get_user_by_id(user_id):
    url = f"{BASE_URL}/{user_id}"
    response = requests.get(url)
    return response

class TestGetUserById(unittest.TestCase):

    @patch('requests.get')
    def test_get_user_by_id_success(self, mock_get):
        user_id = 1
        expected_response = {
            "id": 1,
            "username": "johndoe",
            "password": "hashedpassword",
            "type": "admin",
            "email": "johndoe@example.com",
            "phone": "1234567890",
            "firstName": "John",
            "lastName": "Doe",
            "address": "123 Main St",
            "city": "Anytown",
            "state": "Anystate",
            "pincode": "12345",
            "country": "USA",
            "dateOfBirth": "1990-01-01",
            "gender": "male",
            "profilePicture": "path/to/profile.jpg",
            "emergencyContactName": "Jane Doe",
            "emergencyContactPhone": "0987654321",
            "emergencyContactRelation": "spouse"
        }
        
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = expected_response
        
        response = get_user_by_id(user_id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected_response)

    @patch('requests.get')
    def test_get_user_by_id_unauthorized(self, mock_get):
        user_id = 2
        
        mock_get.return_value.status_code = 401
        mock_get.return_value.json.return_value = {"error": "Unauthorized, only admin user can fetch the user details"}
        
        response = get_user_by_id(user_id)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"error": "Unauthorized, only admin user can fetch the user details"})

    @patch('requests.get')
    def test_get_user_by_id_not_found(self, mock_get):
        user_id = 999  # assuming 999 is a non-existent user ID
        
        mock_get.return_value.status_code = 404
        mock_get.return_value.json.return_value = {"error": "User not found"}
        
        response = get_user_by_id(user_id)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"error": "User not found"})

    @patch('requests.get')
    def test_get_user_by_id_server_error(self, mock_get):
        user_id = 3
        
        mock_get.return_value.status_code = 500
        mock_get.return_value.json.return_value = {"error": "Internal server error"}
        
        response = get_user_by_id(user_id)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {"error": "Internal server error"})

if __name__ == "__main__":
    unittest.main()