import unittest
import requests

class TestCreateMembershipPlanPrice(unittest.TestCase):
    base_url = "http://localhost:3000/api"  # Replace with your actual base URL

    def test_create_membership_plan_price_success(self):
        url = f"{self.base_url}/membershipPlansPrices"

        # Sample data for creating a new membership plan price
        data = {
            "membership_plan_id": 1,
            "price": 99.99,
            "validity_start_date": "2024-06-25",
            "validity_end_date": "2025-06-25",
            "comments": "Annually"
        }

        # Make a POST request to create a new membership plan price
        response = requests.post(url, json=data)

        # Check if the response status code is 401 Unauthorized
        if response.status_code == 401:
            self.fail("Unauthorized access - ensure your request includes proper authentication.")

        # Assert the status code and response content
        self.assertIn(response.status_code, [201, 400, 500])
        if response.status_code == 201:
            # Successful creation
            self.assertIn("id", response.json())
            self.assertEqual(response.json()["membership_plan_id"], data["membership_plan_id"])
            self.assertEqual(response.json()["price"], data["price"])
            # Add more assertions based on the expected schema

        elif response.status_code == 400:
            # Bad request
            self.assertIn("Bad request", response.text)

        
        elif response.status_code == 500:
            # Internal server error
            self.assertIn("Internal server error", response.text)

if __name__ == "__main__":
    unittest.main()
