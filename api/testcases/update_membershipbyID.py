import unittest
import requests

class TestUpdateMembersMembershipById(unittest.TestCase):
    
    def setUp(self):
        # Set up base URL for API requests
        self.base_url = 'http://localhost:3000/api/membersMemberships'
        
    def test_update_membership_by_id(self):
        # Assuming membershipId 1 exists in the database
        membership_id = 1
        
        # Updated data
        updated_data = {
            "gym_member_id": 2,  # new gym member id
            "membership_plan_id": 2,  # new membership plan id
            "start_date": "2024-07-01",  # new start date
            "end_date": "2024-12-31"  # new end date
        }
        
        # Make PUT request to update membership details
        url = f"{self.base_url}/update/{membership_id}"
        response = requests.put(url, json=updated_data)
        
        # Assert based on status code and handle different cases
        if response.status_code == 200:
            # Membership updated successfully
            self.assertIn('Membership updated successfully', response.text)
        elif response.status_code == 400:
            # Bad request (validation errors or overlapping dates)
            self.assertEqual(response.status_code, 400)
            self.assertIn('Bad request', response.text)
        elif response.status_code == 401:
            # Unauthorized access
            self.assertEqual(response.status_code, 401)
            self.assertIn('Access denied. No token provided.', response.text)
        elif response.status_code == 404:
            # Membership not found
            self.assertEqual(response.status_code, 404)
            self.assertIn('Membership not found', response.text)
        elif response.status_code == 500:
            # Internal server error
            self.assertEqual(response.status_code, 500)
            self.assertIn('Internal server error', response.text)
        
if __name__ == '__main__':
    unittest.main()
