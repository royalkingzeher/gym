import requests
import unittest

class TestCreateGymAndGymAdmin(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:3000'
        self.login_url = f'{self.base_url}/api/auth/login/'
        self.create_gymadmin_url = f'{self.base_url}/api/gym/create/'
        self.credentials = {'username': 'testadmin', 'password': 'adminpassword'}

        # Log in to get the token
        login_response = requests.post(self.login_url, data=self.credentials)
        if login_response.status_code == 200:
            self.token = login_response.json().get('token')
        else:
            self.token = None

    def test_create_gym_admin_and_gym(self):
        headers = {'Authorization': f'Token {self.token}'}
        data = {'username': 'gymadmin', 'password': 'gympassword'}
        response = requests.post(self.create_gymadmin_url, headers=headers, data=data)
        self.assertEqual(response.status_code, 404, response.text)

if __name__ == '__main__':
    unittest.main()
