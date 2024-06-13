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
        self.assertEqual(response.status_code, 200)

        # Assert response body contains token
        response_data = response.json()
        self.assertIn('token', response_data)

if __name__ == '__main__':
    unittest.main()