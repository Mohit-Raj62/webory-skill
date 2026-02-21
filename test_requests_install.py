import requests
import json

code = """
import sys
import subprocess
try:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'requests'])
    import requests as req
    print("Requests installed and imported successfully!")
except Exception as e:
    print("Error:", e)
"""

res_judge0 = requests.post(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    json={"language_id": 71, "source_code": code}
)
with open("judge0_req_output.json", "w") as f:
    json.dump(res_judge0.json(), f, indent=2)
