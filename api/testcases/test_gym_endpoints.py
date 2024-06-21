import unittest
import requests

class TestGymAPI(unittest.TestCase):
    def setUp(self):
        # Existing user credentials
        self.username =  'sanskar'
        self.password =  'string25'  
        
        # Login to get the token
        login_response = requests.post('http://localhost:3000/api/login', json={
            'username': self.username,
            'password': self.password
        })
        
        # Print response for debugging
        print('Login response status code:', login_response.status_code)
        print('Login response body:', login_response.text)
        
        # Assert login status code
        self.assertEqual(login_response.status_code, 400)
        
        # Extract token from login response
        login_data = login_response.json()
        self.assertIn('token', login_data)
        self.token = login_data['token']

    def test_create_gym(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        gym_data = {
            "name": "Ultimate Fitness",
            "address": "123 Fitness St",
            "city": "Fitville",
            "state": "Healthy",
            "country": "India",
            "pincode": "123456",
            "phone_number": "1234567890",
            "email": "contact@ultimatefitness.com",
            "website": "http://www.ultimatefitness.com",
            "contact_person": "John Doe",
            "currency": "USD",
            "latitude": 37.7749,
            "longitude": -122.419
        }
        response = requests.post('http://localhost:3000/api/gym', json=gym_data, headers=headers)
        print('Create Gym response status code:', response.status_code)
        print('Create Gym response body:', response.text)
        self.assertEqual(response.status_code, 500)

    def test_get_all_gyms(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        response = requests.get('http://localhost:3000/api/gym', headers=headers)
        print('Get All Gyms response status code:', response.status_code)
        print('Get All Gyms response body:', response.text)
        self.assertEqual(response.status_code, 200)

    def test_get_gym_by_id(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        gym_id = 1  # Update with an actual gym ID from your database
        response = requests.get(f'http://localhost:3000/api/gym/{gym_id}', headers=headers)
        print('Get Gym by ID response status code:', response.status_code)
        print('Get Gym by ID response body:', response.text)
        self.assertEqual(response.status_code, 200)

    def test_get_gym_for_current_user(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        response = requests.post('http://localhost:3000/api/gym/currentUserGym', headers=headers)
        print('Get Gym for Current User response status code:', response.status_code)
        print('Get Gym for Current User response body:', response.text)
        self.assertEqual(response.status_code, 401)

    def test_search_gym_by_parameter(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        search_data = {
            "parameter": "city",
            "value": "Springfield"
        }
        response = requests.post('http://localhost:3000/api/gym/search', json=search_data, headers=headers)
        print('Search Gym by Parameter response status code:', response.status_code)
        print('Search Gym by Parameter response body:', response.text)
        self.assertEqual(response.status_code, 404)

    def test_update_gym_by_id(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        gym_id = 1  # Update with an actual gym ID from your database
        update_data = {
            "name": "Updated Fit Gym",
            "address": "456 Main St"
        }
        response = requests.put(f'http://localhost:3000/api/gym/{gym_id}', json=update_data, headers=headers)
        print('Update Gym by ID response status code:', response.status_code)
        print('Update Gym by ID response body:', response.text)
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
