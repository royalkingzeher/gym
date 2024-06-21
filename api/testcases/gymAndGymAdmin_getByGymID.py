import unittest
import requests

class TestGetGymAdminsOfGym(unittest.TestCase):
    def test_get_gym_admins_of_gym(self):
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
        self.token = response.json().get('token')
        self.headers = {'Authorization': f'Bearer {self.token}'}
        # Send GET request to retrieve all gym admin and gym relationships
        response = requests.get('http://localhost:3000/api/gymAndGymAdmin/gymAdmins/4', headers=self.headers)

        # Assert status code
        self.assertEqual(response.status_code, 200)
        
if __name__ == '__main__':
    unittest.main()
