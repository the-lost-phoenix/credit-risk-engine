import urllib.request
import urllib.parse
import json

url = "http://127.0.0.1:8000/analyze-statement-file"
boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'

# CSV Content
csv_content = """date, amount , type, narration
2023-01-01, 50000, CREDIT, SALARY
2023-01-05, 200, DEBIT, FOOD
"""

# Construct the body
body = (
    f'--{boundary}\r\n'
    f'Content-Disposition: form-data; name="file"; filename="test.csv"\r\n'
    f'Content-Type: text/csv\r\n\r\n'
    f'{csv_content}\r\n'
    f'--{boundary}--\r\n'
)

headers = {
    'Content-Type': f'multipart/form-data; boundary={boundary}',
    'Content-Length': str(len(body))
}

req = urllib.request.Request(url, data=body.encode('utf-8'), headers=headers, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response Body: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Error Body: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Request Failed: {e}")
