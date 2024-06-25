import unittest
import requests
import json

class TestMembershipPlanPriceEndpoints(unittest.TestCase):
    BASE_URL = "http://localhost:3000/api"  # Replace with your actual API base URL
    ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzE5MjkzNDYyLCJleHAiOjE3MTkyOTcwNjJ9.rLCRjEkC4pKN9Y1uyHisKrck-fuc9QQWr819PgaUzDo"
    TEST_PRICE_ID = None
    VALID_MEMBERSHIP_PLAN_ID = 1  # Update with a valid membership plan ID from your database

    @classmethod
    def setUpClass(cls):
        headers = {"Authorization": f"Bearer {cls.ADMIN_TOKEN}"}
        new_price = {
            "membership_plan_id":1,
            "price": 100,
            "validity_start_date": "2025-07-01",
            "validity_end_date": "2026-09-30",
            "comments": "Test setup"
        }
        response = requests.post(f"{cls.BASE_URL}/membershipPlansPrices", headers=headers, json=new_price)
        print(f"Setup response: {response.json()}")
        if response.status_code == 201:
            cls.TEST_PRICE_ID = response.json().get("id")
        else:
            raise Exception("Failed to create a test membership plan price. Response: " + response.text)

    def test_01_get_all_membership_plan_prices(self):
        headers = {"Authorization": f"Bearer {self.ADMIN_TOKEN}"}
        response = requests.get(f"{self.BASE_URL}/membershipPlansPrices", headers=headers)
        print(response.json())
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", response.json())
        self.assertIn("recordsTotal", response.json())

    def test_02_get_specific_membership_plan_price(self):
        headers = {"Authorization": f"Bearer {self.ADMIN_TOKEN}"}
        response = requests.get(f"{self.BASE_URL}/membershipPlansPrices/{self.TEST_PRICE_ID}", headers=headers)
        print(response.json())
        self.assertEqual(response.status_code, 200)
        self.assertIn("id", response.json())

    def test_03_get_specific_membership_plan_price_not_found(self):
        headers = {"Authorization": f"Bearer {self.ADMIN_TOKEN}"}
        price_id = 999  # Non-existent price ID
        response = requests.get(f"{self.BASE_URL}/membershipPlansPrices/{price_id}", headers=headers)
        print(response.json())
        self.assertEqual(response.status_code, 404)

    def test_05_create_membership_plan_price_invalid_dates(self):
        headers = {"Authorization": f"Bearer {self.ADMIN_TOKEN}"}
        new_price = {
            "membership_plan_id": self.VALID_MEMBERSHIP_PLAN_ID,
            "price": 100,
            "validity_start_date": "2022-06-31",  # Invalid date
            "validity_end_date": "2021-07-01",
        }
        response = requests.post(f"{self.BASE_URL}/membershipPlansPrices", headers=headers, json=new_price)
        print(response.json())
        self.assertEqual(response.status_code, 400)

    def test_06_update_membership_plan_price(self):
        headers = {"Authorization": f"Bearer {self.ADMIN_TOKEN}"}
        updated_price = {
            "price": 150,
        }
        response = requests.put(f"{self.BASE_URL}/membershipPlansPrices/update/{self.TEST_PRICE_ID}", headers=headers, json=updated_price)
        print(response.json())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["price"], 150)

    def test_07_update_membership_plan_price_not_found(self):
        headers = {"Authorization": f"Bearer {self.ADMIN_TOKEN}"}
        price_id = 999  # Non-existent price ID
        updated_price = {
            "price": 150,
        }
        response = requests.put(f"{self.BASE_URL}/membershipPlansPrices/update/{price_id}", headers=headers, json=updated_price)
        print(response.json())
        self.assertEqual(response.status_code, 404)

    def test_08_delete_membership_plan_price(self):
        headers = {"Authorization": f"Bearer {self.ADMIN_TOKEN}"}
        response = requests.delete(f"{self.BASE_URL}/membershipPlansPrices/delete/{self.TEST_PRICE_ID}", headers=headers)
        try:
            print(response.json())
        except requests.exceptions.JSONDecodeError:
            print(f"Non-JSON response: {response.text}")
        self.assertEqual(response.status_code, 204)

if __name__ == "__main__":
    unittest.main()
