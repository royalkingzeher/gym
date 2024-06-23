import unittest
import requests

class TestPaymentController(unittest.TestCase):
    BASE_URL = "http://localhost:3000/api/payments"  # Replace with your actual base URL
    HEADERS = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_token_here'  # Replace with a valid token
    }

    def test_create_payment_success(self):
        payload = {
            "gym_member_id": 5,
            "membership_plan_id": 2,
            "start_date": "2024-06-01",
            "end_date": "2024-12-01",
            "payment_date": "2024-06-01",
            "payment_type": "calculated_fee",
            "payment_method": "credit_card",
            "calculation_breakup": "Basic fee",
            "total_amount": 5500.00,
            "comments": "First payment"
        }
        response = requests.post(self.BASE_URL, json=payload, headers=self.HEADERS)
        if response.status_code != 201:
            print(f"Response: {response.json()}")
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.json())

    def test_create_payment_bad_request(self):
        payload = {
            "gym_member_id": "5",  # Invalid type to trigger a bad request
            "membership_plan_id": 2,
            "start_date": "2024-06-01",
            "end_date": "2024-12-01",
            "payment_date": "2024-07-01",
            "payment_type": "calculated_fee",
            "payment_method": "credit_card",
            "calculation_breakup": "Basic fee",
            "total_amount": 5500.00,
            "comments": "First payment"
        }
        response = requests.post(self.BASE_URL, json=payload, headers=self.HEADERS)
        self.assertEqual(response.status_code, 400)

    def test_create_payment_unauthorized(self):
        payload = {
            "gym_member_id": 5,
            "membership_plan_id": 2,
            "start_date": "2024-06-01",
            "end_date": "2024-12-01",
            "payment_date": "2024-07-01",
            "payment_type": "calculated_fee",
            "payment_method": "credit_card",
            "calculation_breakup": "Basic fee",
            "total_amount": 5500.00,
            "comments": "First payment"
        }
        headers = {
            'Content-Type': 'application/json'
            # No Authorization header
        }
        response = requests.post(self.BASE_URL, json=payload, headers=headers)
        self.assertEqual(response.status_code, 401)

    def test_create_payment_internal_server_error(self):
        payload = {
            "gym_member_id": 5,
            "membership_plan_id": 2,
            "start_date": "2024-06-01",
            "end_date": "2024-12-01",
            "payment_date": "2024-07-01",
            "payment_type": "calculated_fee",
            "payment_method": "credit_card",
            "calculation_breakup": "Basic fee",
            "total_amount": 5500.00,
            "comments": "First payment"
        }
        response = requests.post(f"{self.BASE_URL}/simulate_internal_error", json=payload, headers=self.HEADERS)
        if response.status_code != 500:
            print(f"Response: {response.json()}")
        self.assertEqual(response.status_code, 500)

if __name__ == '__main__':
    unittest.main()
