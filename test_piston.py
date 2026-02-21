import requests
import json

code = """
import sys
try:
    import numpy as np
    print("Numpy version:", np.__version__)
except ImportError as e:
    print("Numpy not found:", e)

try:
    import pandas as pd
    print("Pandas version:", pd.__version__)
except ImportError as e:
    print("Pandas not found:", e)
"""

res = requests.post(
    "https://emkc.org/api/v2/piston/execute",
    json={
        "language": "python",
        "version": "3.10.0",
        "files": [{"name": "main.py", "content": code}]
    }
)
try:
    print("Piston:", json.dumps(res.json(), indent=2))
except:
    print("Piston error", res.text)
