import unittest
import requests
import random
import string

class TestSignupAdmin(unittest.TestCase):
    def test_signup_admin(self):
        # Generate random username and password
        random_username = 'admin_' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        random_password = 'pass' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))

        # Send POST request
        response = requests.post('http://localhost:3000/api/signup/admin', json={
            'username': random_username,
            'password': random_password
        })

        # Assert status code
        self.assertEqual(response.status_code, 200)

        # Assert response body
        response_data = response.json()
        self.assertEqual(response_data['message'], 'Admin user created successfully')
        self.assertIn('id', response_data['user'])
        self.assertEqual(response_data['user']['username'], random_username)

if __name__ == '__main__':
    unittest.main()
