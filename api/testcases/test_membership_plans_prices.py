import unittest
import requests

BASE_URL = "http://localhost:3000/api/membership-plans-prices"

class TestMembershipPlansPricesAPI(unittest.TestCase):

    def test_get_all_membership_plan_prices(self):
        response = requests.get(BASE_URL)
        self.assertEqual(response.status_code, 401)
        self.assertIsInstance(response.json(), list)

    def test_get_membership_plan_price_by_id(self):
        # Assuming there is a membership plan price with ID 1
        response = requests.get(f"{BASE_URL}/1")
        self.assertIn(response.status_code, [200, 404])  # It can either be found or not found
        if response.status_code == 200:
            self.assertIsInstance(response.json(), dict)

    def test_create_membership_plan_price(self):
        payload = {
            "membership_plan_id": 101,
            "price": 49.99,
            "validity_start_date": "2023-01-01T00:00:00.000Z",
            "validity_end_date": "2023-12-31T23:59:59.000Z",
            "comments": "Early bird discount"
        }
        response = requests.post(BASE_URL, json=payload)
        self.assertEqual(response.status_code, 401)
        self.assertIn("id", response.json())

    def test_update_membership_plan_price(self):
        # Assuming there is a membership plan price with ID 1
        payload = {
            "price": 59.99,
            "comments": "Updated discount"
        }
        response = requests.put(f"{BASE_URL}/1", json=payload)
        self.assertIn(response.status_code, [200, 404])
        if response.status_code == 200:
            self.assertEqual(response.json()["price"], 59.99)

    def test_delete_membership_plan_price(self):
        # Assuming there is a membership plan price with ID 1
        response = requests.delete(f"{BASE_URL}/1")
        self.assertIn(response.status_code, [200, 404])
        if response.status_code == 200:
            self.assertEqual(response.json()["message"], "Membership plan price deleted successfully")

if __name__ == "__main__":
    unittest.main()
