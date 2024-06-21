import unittest
import requests

class TestCreateMembershipPlanPrice(unittest.TestCase):
    base_url = "http://localhost:3000/api"  # Replace with your actual base URL
    auth_token = "your_auth_token_here"  # Replace with a valid JWT token or auth mechanism

    def test_create_membership_plan_price_success(self):
        url = f"{self.base_url}/membershipPlansPrices"

        # Sample data for creating a new membership plan price
        data = {
            "membership_plan_id": 1,
            "price": 99.99,
            "validity_start_date": "2024-06-25",
            "validity_end_date": "2024-07-25",
            "comments": "Annually"
        }

        # Define headers with authentication token
        headers = {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json"
        }

        # Make a POST request to create a new membership plan price with headers
        response = requests.post(url, json=data, headers=headers)

        # Assert the status code and response content
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

        else:
            # Handle unexpected status codes
            self.fail(f"Unexpected status code: {response.status_code}. Response text: {response.text}")

if __name__ == "__main__":
    unittest.main()
