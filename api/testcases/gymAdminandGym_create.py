import unittest
import requests

class TestCreateGymAdminAndGym(unittest.TestCase):
    def test_create_gym_admin_and_gym(self):
        # Existing user credentials
        username = 'gymsoftware'
        password ='gymsoftware'
        # Send POST request
        response = requests.post('http://localhost:3000/api/login', json={
            'username': username,
            'password': password
        })
        # Assert status code
        self.assertEqual(response.status_code, 200)
        # Assert response body contains token
        self.token = response.json().get('token')
        self.headers = {'Authorization': f'Bearer {self.token}'}
        # Send POST request
        response = requests.post('http://localhost:3000/api/gymAdminAndGym', json={
            'gymAdminId': 30,
            'gymId': 5
        },headers=self.headers)
        # Assert status code
        self.assertEqual(response.status_code, 400)
        
if __name__ == '__main__':
    unittest.main()