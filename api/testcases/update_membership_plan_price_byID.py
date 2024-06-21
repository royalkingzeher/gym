import requests
import unittests
import json

# Define the base URL of your API
BASE_URL = 'http://localhost:3000/api/'

# Function to perform PUT request to update membership plan price by ID
def update_membership_plan_price(price_id, payload, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'

    response = requests.put(f'{BASE_URL}/membershipPlansPrices/update/{price_id}', headers=headers, data=json.dumps(payload))
    return response

# Test cases
def test_update_existing_price():
    # Existing price ID to update
    price_id = 1
    payload = {
        "price": 120.00,
        "validity_start_date": "2024-07-01",
        "validity_end_date": "2024-12-31"
    }
    response = update_membership_plan_price(price_id, payload)
    assert response.status_code == 200
    print("Test Case: Update existing price - Passed")

def test_invalid_date_order():
    price_id = 1
    payload = {
        "validity_start_date": "2024-12-31",
        "validity_end_date": "2024-07-01"
    }
    response = update_membership_plan_price(price_id, payload)
    assert response.status_code == 400
    print("Test Case: Invalid date order - Passed")

def test_unauthorized():
    price_id = 1
    payload = {
        "price": 99.99,
        "validity_start_date": "2024-07-01",
        "validity_end_date": "2024-12-31"
    }
    # Simulate unauthorized request by not providing a token
    response = update_membership_plan_price(price_id, payload)
    assert response.status_code == 401
    print("Test Case: Unauthorized update attempt - Passed")

def test_price_not_found():
    # Use a non-existent price ID
    price_id = 999
    payload = {
        "price": 99.99,
        "validity_start_date": "2024-07-01",
        "validity_end_date": "2024-12-31"
    }
    response = update_membership_plan_price(price_id, payload)
    assert response.status_code == 404
    print("Test Case: Price not found - Passed")

def test_internal_server_error():
    # Trigger an internal server error (e.g., malformed payload)
    price_id = 1
    payload = {
        "price": "invalid_price",  # Malformed data
        "validity_start_date": "2024-07-01",
        "validity_end_date": "2024-12-31"
    }
    response = update_membership_plan_price(price_id, payload)
    assert response.status_code == 500
    print("Test Case: Internal server error - Passed")

# Run the test cases
if __name__ == '__main__':
    test_update_existing_price()
    test_invalid_date_order()
    test_unauthorized()
    test_price_not_found()
    test_internal_server_error()
