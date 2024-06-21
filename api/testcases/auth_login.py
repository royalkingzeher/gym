import unittest
import requests

class TestLogin(unittest.TestCase):
    def setUp(self):
        self.base_url = 'http://localhost:3000'
        self.login_url = f'{self.base_url}/api/login'
        self.credentials = {
            'username': 'sanskar',
            'password': 'string25'
        }

    def test_login(self):
        # Send POST request
        response = requests.post(self.login_url, json=self.credentials)

        # Assert status code (Assuming successful login returns 200)
        self.assertEqual(response.status_code, 200, "Expected status code 200 for successful login")

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
