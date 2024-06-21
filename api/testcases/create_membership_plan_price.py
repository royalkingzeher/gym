import unittest
import requests

class TestCreateMembershipPlanPrice(unittest.TestCase):
    base_url = "http://localhost:3000/api-docs"  # Base URL for your API
    auth_token = "your_auth_token_here"  # Replace with a valid JWT token or auth mechanism

    def test_create_membership_plan_price_success(self):
        url = f"{self.base_url}/membershipPlansPrices"

        # Sample data for creating a new membership plan price
        data = {
            "membership_plan_id": 6,
            "price": 1199.99,
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

        # Debug output for response
        print("Status Code:", response.status_code)
        print("Response Body:", response.json())

        # Assert the status code and response content
        self.assertEqual(response.status_code, 201, f"Unexpected status code: {response.status_code}")

        response_data = response.json()
        self.assertIn("id", response_data, "Response JSON does not contain 'id'.")
        self.assertEqual(response_data["membership_plan_id"], data["membership_plan_id"], "Membership plan ID does not match.")
        self.assertEqual(response_data["price"], data["price"], "Price does not match.")
        # Add more assertions based on the expected schema

if __name__ == "__main__":
    unittest.main()
