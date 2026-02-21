import requests
import json

code = """
import sys
import os
import subprocess

os.makedirs('/tmp/packages', exist_ok=True)
sys.path.append('/tmp/packages')

try:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-t', '/tmp/packages', 'numpy'])
    import numpy as np
    print("Numpy installed:", np.__version__)
except Exception as e:
    print("Numpy Error:", e)

try:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-t', '/tmp/packages', 'requests'])
    import requests as req
    print("Requests installed:", req.__version__)
except Exception as e:
    print("Requests Error:", e)
"""

res_judge0 = requests.post(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    json={"language_id": 71, "source_code": code}
)
with open("judge0_custom_dir.json", "w") as f:
    json.dump(res_judge0.json(), f, indent=2)
