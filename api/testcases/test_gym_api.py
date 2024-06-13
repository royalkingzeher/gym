import unittest
import requests
import json

class TestGymAPI(unittest.TestCase):
    BASE_URL = 'http://localhost:3000/api/gym'  # Replace with your actual base URL

    def setUp(self):
        # Set up necessary preconditions here
        self.admin_token = 'Bearer validAdminToken'  # Replace with actual token
        self.non_admin_token = 'Bearer validNonAdminToken'  # Replace with actual token
        self.headers = {'Content-Type': 'application/json'}

    def test_create_gym_success(self):
        data = {
            "name": "Test Gym",
            "address": "123 Test St",
            "city": "Test City",
            "state": "Test State",
            "country": "Test Country",
            "pincode": "123456",
            "phone_number": "1234567890",
            "email": "testgym@example.com",
            "contact_person": "John Doe",
            "currency": "USD",
            "latitude": 12.34,
            "longitude": 56.78
        }
        response = requests.post(self.BASE_URL, headers={**self.headers, 'Authorization': self.admin_token}, json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('id', response.json())

    def test_create_gym_unauthorized(self):
        data = {
            "name": "Test Gym",
            "address": "123 Test St",
            "city": "Test City",
            "state": "Test State",
            "country": "Test Country",
            "pincode": "123456",
            "phone_number": "1234567890",
            "email": "testgym@example.com",
            "contact_person": "John Doe",
            "currency": "USD",
            "latitude": 12.34,
            "longitude": 56.78
        }
        response = requests.post(self.BASE_URL, headers={**self.headers, 'Authorization': self.non_admin_token}, json=data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.text, 'Unauthorized, only admin user can create gym')

    def test_create_gym_validation_error(self):
        data = {
            "name": "Test Gym",
            "address": "123 Test St",
            "city": "Test City",
            "state": "Test State",
            "country": "Test Country",
            "pincode": "1234",  # Invalid pincode
            "phone_number": "12345678",  # Invalid phone number
            "email": "testgymatexample.com",  # Invalid email
            "contact_person": "John Doe",
            "currency": "USD",
            "latitude": "Not a number",  # Invalid latitude
            "longitude": "Not a number"  # Invalid longitude
        }
        response = requests.post(self.BASE_URL, headers={**self.headers, 'Authorization': self.admin_token}, json=data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Validation error')

    def test_get_all_gyms_success(self):
        response = requests.get(self.BASE_URL, headers={**self.headers, 'Authorization': self.admin_token})
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_get_all_gyms_unauthorized(self):
        response = requests.get(self.BASE_URL, headers={**self.headers, 'Authorization': self.non_admin_token})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.text, 'Unauthorized, only admin user can view gyms')

    def test_get_gym_by_id_success(self):
        gym_id = 1  # Replace with an existing gym ID
        response = requests.get(f'{self.BASE_URL}/{gym_id}', headers={**self.headers, 'Authorization': self.admin_token})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['id'], gym_id)

    def test_get_gym_by_id_unauthorized(self):
        gym_id = 1  # Replace with an existing gym ID
        response = requests.get(f'{self.BASE_URL}/{gym_id}', headers={**self.headers, 'Authorization': self.non_admin_token})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.text, 'Unauthorized, only admin user can view gyms')

    def test_get_gym_by_id_not_found(self):
        gym_id = 999999  # Replace with a non-existent gym ID
        response = requests.get(f'{self.BASE_URL}/{gym_id}', headers={**self.headers, 'Authorization': self.admin_token})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.text, 'Gym not found')

    def test_search_gym_by_parameter_success(self):
        data = {
            "parameter": "city",
            "value": "Test City"
        }
        response = requests.post(f'{self.BASE_URL}/search', headers={**self.headers, 'Authorization': self.admin_token}, json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_search_gym_by_parameter_not_found(self):
        data = {
            "parameter": "city",
            "value": "Non Existent City"
        }
        response = requests.post(f'{self.BASE_URL}/search', headers={**self.headers, 'Authorization': self.admin_token}, json=data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Not Found')

    def test_update_gym_by_id_success(self):
        gym_id = 1  # Replace with an existing gym ID
        data = {
            "name": "Updated Test Gym",
            "address": "123 Updated Test St"
        }
        response = requests.put(f'{self.BASE_URL}/{gym_id}', headers={**self.headers, 'Authorization': self.admin_token}, json=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], data['name'])

    def test_update_gym_by_id_unauthorized(self):
        gym_id = 1  # Replace with an existing gym ID
        data = {
            "name": "Updated Test Gym",
            "address": "123 Updated Test St"
        }
        response = requests.put(f'{self.BASE_URL}/{gym_id}', headers={**self.headers, 'Authorization': self.non_admin_token}, json=data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.text, 'Unauthorized, only admin user can update gyms')

    def test_update_gym_by_id_not_found(self):
        gym_id = 999999  # Replace with a non-existent gym ID
        data = {
            "name": "Updated Test Gym",
            "address": "123 Updated Test St"
        }
        response = requests.put(f'{self.BASE_URL}/{gym_id}', headers={**self.headers, 'Authorization': self.admin_token}, json=data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Not Found')

if __name__ == '__main__':
    unittest.main()
