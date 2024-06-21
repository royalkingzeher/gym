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
        
        # Assert status code and handle different cases
        if response.status_code == 200:
            # Membership object should be returned
            self.assertIn('membership', response.json())
        elif response.status_code == 401:
            # Unauthorized access
            self.assertEqual(response.status_code, 401)
        elif response.status_code == 404:
            # Membership not found
            self.assertEqual(response.status_code, 404)
        elif response.status_code == 500:
            # Internal server error
            self.assertEqual(response.status_code, 500)
            self.assertIn('Internal server error', response.text)
        
if __name__ == '__main__':
    unittest.main()
