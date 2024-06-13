import unittest
import requests
import random
import string

class TestGymAdminAndGym(unittest.TestCase):
    BASE_URL = 'http://localhost:3000/api'
    
    def setUp(self):
        # Login as admin to get a token
        login_response = requests.post(f'{self.BASE_URL}/login', json={
            'username': 'admin_user',
            'password': 'admin_password'
        })
        self.assertEqual(login_response.status_code, 200, "Login failed")
        
        login_data = login_response.json()
        self.token = login_data.get('token')
        self.assertIsNotNone(self.token, "Token not received")
        
        # Create a gymAdmin user and a gym for testing
        self.gym_admin = self.create_gym_admin()
        self.gym = self.create_gym()

    def create_gym_admin(self):
        random_username = 'gymadmin_' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        response = requests.post(f'{self.BASE_URL}/signup/gymadmin', json={
            'username': random_username,
            'password': 'password123',
            'firstName': 'FirstName',
            'lastName': 'LastName',
            'email': f'{random_username}@example.com',
            'phone': '1234567890',
            'address': 'Address',
            'city': 'City',
            'state': 'State',
            'pincode': '123456',
            'country': 'Country',
            'dateOfBirth': '2000-01-01',
            'gender': 'male',
            'profilePicture': 'ProfilePicture',
            'emergencyContactName': 'EmergencyContact',
            'emergencyContactRelationship': 'Friend',
            'emergencyContactPhone': '1234567890',
            'emergencyContactEmail': 'emergency@example.com'
        }, headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        return response.json()

    def create_gym(self):
        random_gym_name = 'gym_' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        response = requests.post(f'{self.BASE_URL}/gym', json={
            'name': random_gym_name,
            'address': 'Address',
            'city': 'City',
            'state': 'State',
            'pincode': '123456',
            'country': 'Country'
        }, headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_create_gym_admin_and_gym(self):
        response = requests.post(f'{self.BASE_URL}/gymAdminAndGym', json={
            'gymAdminId': self.gym_admin['id'],
            'gymId': self.gym['id']
        }, headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['gymAdminId'], self.gym_admin['id'])
        self.assertEqual(data['gymId'], self.gym['id'])

    def test_get_all_gym_admin_and_gyms(self):
        response = requests.get(f'{self.BASE_URL}/gymAdminAndGym', headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_get_gym_admins_of_gym(self):
        response = requests.get(f'{self.BASE_URL}/gymAdminAndGym/gymAdmins/{self.gym["id"]}', headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_get_gyms_of_gym_admin(self):
        response = requests.get(f'{self.BASE_URL}/gymAdminAndGym/gyms/{self.gym_admin["id"]}', headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

if __name__ == '__main__':
    unittest.main()
