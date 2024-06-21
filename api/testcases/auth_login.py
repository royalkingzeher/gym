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

        # Check if response content is not empty
        self.assertTrue(response.content, "Response content is empty")

        # Try to parse the response as JSON
        try:
            response_data = response.json()
        except requests.exceptions.JSONDecodeError:
            # Print the actual response content for debugging
            print("Response content (not JSON):", response.content.decode('utf-8'))
            self.fail("Response is not in JSON format")

        # Assert response body contains token
        self.assertIn('token', response_data, "Response JSON does not contain 'token'")

if __name__ == '__main__':
    unittest.main()
