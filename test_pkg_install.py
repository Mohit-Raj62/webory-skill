import requests
import json

code = """
import subprocess
import sys

try:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'numpy'])
    import numpy as np
    print("Numpy installed:", np.__version__)
except Exception as e:
    print("Error:", e)
"""

res_judge0 = requests.post(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    json={"language_id": 71, "source_code": code}
)
with open("judge0_output.json", "w") as f:
    json.dump(res_judge0.json(), f, indent=2)
