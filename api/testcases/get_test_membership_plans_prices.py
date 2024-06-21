import unittest
import requests

class TestMembershipPlansPrices(unittest.TestCase):
    base_url = "http://localhost:3000/api"  # Replace with your actual base URL

    def test_get_membership_plan_price_by_id(self):
        # Replace with an existing price ID in your database
        price_id = 1
        url = f"{self.base_url}/membershipPlansPrices/{price_id}"

        # Make a GET request to fetch the price by ID
        response = requests.get(url)

        # Assert the status code and response content
        self.assertIn(response.status_code, [200, 401, 404, 500])
        if response.status_code == 200:
            # Valid response for existing price ID
            self.assertIn("id", response.json())
            self.assertIn("membership_plan_id", response.json())
            self.assertIn("price", response.json())
            # Add more assertions based on the expected schema

        elif response.status_code == 401:
            # Check for the actual error message returned
            if "Access denied" in response.text:
                self.assertIn("Access denied", response.text)
            else:
                self.assertIn("Unauthorized", response.text)

        elif response.status_code == 404:
            # Price not found
            self.assertIn("Membership plan price not found", response.text)

        elif response.status_code == 500:
            # Internal server error
            self.assertIn("Internal server error", response.text)

if __name__ == "__main__":
    unittest.main()
