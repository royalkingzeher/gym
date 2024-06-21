import requests
import unittest

class TestSignupGymAdmin(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:3000'
        self.login_url = f'{self.base_url}/api/auth/login/'
        self.signup_url = f'{self.base_url}/api/auth/signup/'
        self.credentials = {'username': 'testadmin', 'password': 'adminpassword'}

        # Log in to get the token
        login_response = requests.post(self.login_url, data=self.credentials)
        if login_response.status_code == 200:
            self.token = login_response.json().get('token')
        else:
            self.token = None

    def test_signup_gymadmin(self):
        headers = {'Authorization': f'Token {self.token}'}
        data = {'username': 'newadmin', 'password': 'newpassword'}
        response = requests.post(self.signup_url, headers=headers, data=data)
        self.assertEqual(response.status_code, 201, response.text)

if __name__ == '__main__':
    unittest.main()
