import unittest
import requests

class TestCreateMembersMembership(unittest.TestCase):
    
    def setUp(self):
        # Set up base URL for API requests
        self.base_url = 'http://localhost:3000/api/membersMemberships'
        
    def test_create_new_membership(self):
        # Test data
        membership_data = {
            "gym_member_id": 1,
            "membership_plan_id": 1,
            "start_date": "2024-06-21",
            "end_date": "2024-12-21"
        }
        
        # Make POST request to create new membership
        response = requests.post(self.base_url, json=membership_data)
        
        # Assert status code 201 (Created)
        self.assertEqual(response.status_code, 201)
        
        # Optionally, you can assert more details about the response
        
if __name__ == '__main__':
    unittest.main()
