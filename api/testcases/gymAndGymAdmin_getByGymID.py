import requests
import unittest

class TestGetGymAdminsOfGym(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:3000'
        self.login_url = f'{self.base_url}/api/auth/login/'
        self.credentials = {'username': 'testadmin', 'password': 'adminpassword'}
        self.gym_id = 6  # Replace with a valid gym_id

        # Log in to get the token
        login_response = requests.post(self.login_url, data=self.credentials)
        if login_response.status_code == 200:
            self.token = login_response.json().get('token')
        else:
            self.token = None

        self.get_by_gym_id_url = f'{self.base_url}/api/gym/{self.gym_id}/admins/'

    def test_get_gym_admins_of_gym(self):
        headers = {'Authorization': f'Token {self.token}'}
        response = requests.get(self.get_by_gym_id_url, headers=headers)
        self.assertEqual(response.status_code, 404, response.text)

if __name__ == '__main__':
    unittest.main()
