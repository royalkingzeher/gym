import unittest
import requests
import json

class TestGetUserById(unittest.TestCase):
    BASE_URL = 'http://localhost:3000/api/users'  # Replace with your actual base URL

    def setUp(self):
        # Set up any necessary preconditions here
        self.admin_token = 'Bearer validAdminToken'  # Replace with actual token
        self.non_admin_token = 'Bearer validNonAdminToken'  # Replace with actual token
        self.headers = {'Content-Type': 'application/json'}
    
    def test_get_user_by_id_success(self):
        user_id = 1  # Replace with actual user ID
        response = requests.get(f'{self.BASE_URL}/{user_id}', headers={**self.headers, 'Authorization': self.admin_token})
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('id', response.json())
        self.assertEqual(response.json()['id'], user_id)
    
    def test_get_user_by_id_unauthorized(self):
        user_id = 1  # Replace with actual user ID
        response = requests.get(f'{self.BASE_URL}/{user_id}', headers={**self.headers, 'Authorization': self.non_admin_token})
        
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.text, 'Unauthorized, only admin user can fetch the user details')
    
    def test_get_user_by_id_not_found(self):
        user_id = 999999  # Replace with non-existent user ID
        response = requests.get(f'{self.BASE_URL}/{user_id}', headers={**self.headers, 'Authorization': self.admin_token})
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.text, 'User not found.')
    
    def test_get_user_by_id_invalid_id(self):
        user_id = 'invalidId'
        response = requests.get(f'{self.BASE_URL}/{user_id}', headers={**self.headers, 'Authorization': self.admin_token})
        
        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertEqual(response_data['error'], 'Validation error')
        self.assertIn('User ID must be a valid number', response_data['details'])
    
    def test_get_user_by_id_internal_server_error(self):
        user_id = 1  # Replace with actual user ID

        # Mocking an internal server error by manipulating the endpoint (optional, based on your setup)
        # Assuming you have a way to induce an error in your server, you can simulate it here.

        response = requests.get(f'{self.BASE_URL}/{user_id}', headers={**self.headers, 'Authorization': self.admin_token})
        
        self.assertIn(response.status_code, [200, 500])  # Expecting 500 if an error is induced
        if response.status_code == 500:
            self.assertEqual(response.text, 'Internal server error.')

if __name__ == '__main__':
    unittest.main()
