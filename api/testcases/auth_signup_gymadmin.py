import unittest
import requests
import random
import string

class TestSignupGymAdmin(unittest.TestCase):
    def setUp(self):
        # Login as admin to get a token
        login_response = requests.post('http://localhost:3000/api/login', json={
            'username': 'gymsoftware',
            'password': 'gymsoftware'
        })
        
        self.assertEqual(login_response.status_code, 200, "Login failed")
        
        login_data = login_response.json()
        self.token = login_data.get('token')
        self.assertIsNotNone(self.token, "Token not received")

    def test_signup_gymadmin(self):
        # Generate random data
        random_username = 'gymadmin_' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        random_password = 'pass' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        random_email = random_username + '@example.com'
        random_phone = ''.join(random.choices(string.digits, k=10))

        # Send POST request
        response = requests.post('http://localhost:3000/api/signup/gymadmin', json={
            'username': random_username,
            'password': random_password,
            'firstName': 'FirstName',
            'lastName': 'LastName',
            'email': random_email,
            'phone': random_phone,
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

        # Assert status code
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()