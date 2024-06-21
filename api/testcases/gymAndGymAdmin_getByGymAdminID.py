import requests
import unittest

class TestGetGymsOfGymAdmin(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:8000'
        self.login_url = f'{self.base_url}/api/auth/login/'
        self.credentials = {'username': 'testadmin', 'password': 'adminpassword'}
        self.gymadmin_id = 22  # Replace with a valid gymadmin_id

        # Log in to get the token
        login_response = requests.post(self.login_url, data=self.credentials)
        if login_response.status_code == 200:
            self.token = login_response.json().get('token')
        else:
            self.token = None

        self.get_by_gymadmin_url = f'{self.base_url}/api/gym/gymadmin/{self.gymadmin_id}/'

    def test_get_gyms_of_gym_admin(self):
        headers = {'Authorization': f'Token {self.token}'}
        response = requests.get(self.get_by_gymadmin_url, headers=headers)
        self.assertEqual(response.status_code, 200, response.text)

if __name__ == '__main__':
    unittest.main()
