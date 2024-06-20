import unittest
import requests

class TestLogin(unittest.TestCase):
    def test_login(self):
        # Existing user credentials
        username = 'gymsoftware'
        password = 'gymsoftware'

        # Send POST request
        response = requests.post('http://localhost:3000/api/login', json={
            'username': username,
            'password': password
        })

        # Assert status code
        self.assertEqual(response.status_code, 400)

        # Check if response content is not empty and is in JSON format
        self.assertTrue(response.content, "Response content is empty")
        
        try:
            response_data = response.json()
        except requests.exceptions.JSONDecodeError:
            self.fail("Response is not in JSON format")

        # Assert response body contains token
        self.assertIn('token', response_data)

if __name__ == '__main__':
    unittest.main()
