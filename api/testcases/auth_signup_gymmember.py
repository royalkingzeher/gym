import unittest
import requests
import random
import string

class TestSignupGymMember(unittest.TestCase):
    def test_signup_gymmember(self):
        # Generate random data
        random_username = 'gymmember_' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        random_password = 'pass' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        random_email = random_username + '@example.com'
        random_phone = ''.join(random.choices(string.digits, k=10))

        # Assuming you have a gym with ID 1
        gym_id = 4

        # Send POST request
        response = requests.post('http://localhost:3000/api/signup/gymmember', json={
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
            'emergencyContactEmail': 'emergency@example.com',
            'gymId': gym_id
        })


        # Assert status code
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()