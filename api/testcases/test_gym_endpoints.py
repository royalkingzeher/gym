import requests
import unittest

class TestGymAPI(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:3000'
        self.login_url = f'{self.base_url}/api/auth/login/'
        self.credentials = {'username': 'testadmin', 'password': 'adminpassword'}

        # Log in to get the token
        login_response = requests.post(self.login_url, data=self.credentials)
        if login_response.status_code == 200:
            self.token = login_response.json().get('token')
        else:
            self.token = None

    def test_create_gym(self):
        headers = {'Authorization': f'Token {self.token}'}
        create_gym_url = f'{self.base_url}/api/gym/create/'
        data = {'name': 'Test Gym', 'location': 'Test Location'}
        response = requests.post(create_gym_url, headers=headers, data=data)
        self.assertEqual(response.status_code, 404, response.text)

    def test_get_all_gyms(self):
        headers = {'Authorization': f'Token {self.token}'}
        get_all_gyms_url = f'{self.base_url}/api/gym/all/'
        response = requests.get(get_all_gyms_url, headers=headers)
        self.assertEqual(response.status_code, 400, response.text)

    def test_get_gym_by_id(self):
        headers = {'Authorization': f'Token {self.token}'}
        gym_id = 1  # Adjust this as necessary
        get_gym_by_id_url = f'{self.base_url}/api/gym/{gym_id}/'
        response = requests.get(get_gym_by_id_url, headers=headers)
        self.assertEqual(response.status_code, 400, response.text)

    def test_get_gym_for_current_user(self):
        headers = {'Authorization': f'Token {self.token}'}
        get_gym_for_user_url = f'{self.base_url}/api/gym/user/'
        response = requests.get(get_gym_for_user_url, headers=headers)
        self.assertEqual(response.status_code, 400, response.text)

if __name__ == '__main__':
    unittest.main()
