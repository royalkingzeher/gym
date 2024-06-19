import unittest
import requests

class TestDietPlansAPI(unittest.TestCase):
    def setUp(self):
        # Existing user credentials
        self.username = 'sanskar'
        self.password = 'string25'

        # Login to get the token
        login_response = requests.post('http://localhost:3000/api/login', json={
            'username': self.username,
            'password': self.password
        })
        
        # Print response for debugging
        print('Login response status code:', login_response.status_code)
        print('Login response body:', login_response.text)
        
        # Assert login status code
        self.assertEqual(login_response.status_code, 200)
        
        # Extract token from login response
        login_data = login_response.json()
        self.assertIn('token', login_data)
        self.token = login_data['token']

    def test_create_diet_plan(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        diet_plan_data = {
            "gym_member_id": 1,
            "diet_plan_name": "Keto Plan",
            "comments": "Low carb, high fat",
            "diet_plan_chart": "Breakfast: Eggs, Lunch: Salad, Dinner: Steak"
        }
        response = requests.post('http://localhost:3000/api/diet-plans', json=diet_plan_data, headers=headers)
        print('Create Diet Plan response status code:', response.status_code)
        print('Create Diet Plan response body:', response.text)
        self.assertEqual(response.status_code, 201)

    def test_get_all_diet_plans(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        response = requests.get('http://localhost:3000/api/diet-plans', headers=headers)
        print('Get All Diet Plans response status code:', response.status_code)
        print('Get All Diet Plans response body:', response.text)
        self.assertEqual(response.status_code, 200)

    def test_get_diet_plan_by_id(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        diet_plan_id = 1  # Update with an actual diet plan ID from your database
        response = requests.get(f'http://localhost:3000/api/diet-plans/{diet_plan_id}', headers=headers)
        print('Get Diet Plan by ID response status code:', response.status_code)
        print('Get Diet Plan by ID response body:', response.text)
        self.assertEqual(response.status_code, 200)

    def test_update_diet_plan_by_id(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        diet_plan_id = 1  # Update with an actual diet plan ID from your database
        update_data = {
            "gym_member_id": 1,
            "diet_plan_name": "Updated Keto Plan",
            "comments": "Updated comments",
            "diet_plan_chart": "Updated diet plan chart"
        }
        response = requests.put(f'http://localhost:3000/api/diet-plans/{diet_plan_id}', json=update_data, headers=headers)
        print('Update Diet Plan by ID response status code:', response.status_code)
        print('Update Diet Plan by ID response body:', response.text)
        self.assertEqual(response.status_code, 200)

    def test_delete_diet_plan_by_id(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        diet_plan_id = 1  # Update with an actual diet plan ID from your database
        response = requests.delete(f'http://localhost:3000/api/diet-plans/{diet_plan_id}', headers=headers)
        print('Delete Diet Plan by ID response status code:', response.status_code)
        print('Delete Diet Plan by ID response body:', response.text)
        self.assertEqual(response.status_code, 204)

if __name__ == '__main__':
    unittest.main()
