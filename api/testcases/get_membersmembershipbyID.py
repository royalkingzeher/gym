import unittest
import requests

class TestGetMembersMembershipById(unittest.TestCase):
    
    def setUp(self):
        # Set up base URL for API requests
        self.base_url = 'http://localhost:3000/api/membersMemberships'
        
    def test_get_membership_by_id(self):
        # Assuming membershipId 1 exists in the database
        membership_id = 1
        
        # Make GET request to fetch membership details
        url = f"{self.base_url}/{membership_id}"
        response = requests.get(url)
        
        # Assert status code 200 (OK)
        self.assertEqual(response.status_code, 200)
        
        # Optionally, you can assert more details about the response
        
if __name__ == '__main__':
    unittest.main()
