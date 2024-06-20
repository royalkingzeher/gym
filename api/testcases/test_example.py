import unittest
import requests

class TestAPI(unittest.TestCase):
    def test_api_response(self):
        response = requests.get("http://localhost:3000/api/endpoint")
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
