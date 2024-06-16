import unittest
import requests

class TestUserDetails(unittest.TestCase):
    def setUp(self):
        # Existing user credentials
        self.username = 'gymsoftware'
        self.password = 'gymsoftware'
        
        # Login to get the token
        login_response = requests.post('http://localhost:3000/api/login', json={
            'username': self.username,
            'password': self.password
        })
        
        # Assert login status code
        self.assertEqual(login_response.status_code, 200)
        
        # Extract token from login response
        login_data = login_response.json()
        self.assertIn('token', login_data)
        self.token = login_data['token']

    def test_user_details(self):
        # Send POST request to get user details
        headers = {
            'Authorization': f'Bearer {self.token}'
        }
        response = requests.post('http://localhost:3000/api/userDetails', headers=headers)

        # Assert status code
        self.assertEqual(response.status_code, 200)

        # Assert response body
        response_data = response.json()
        self.assertIn('id', response_data)
        self.assertIn('username', response_data)
        self.assertNotIn('password', response_data)

if __name__ == '__main__':
    unittest.main()