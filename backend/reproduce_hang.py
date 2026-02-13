
from app.core.security import verify_password
from app.crud import DUMMY_HASH
import time

print("Starting verification with DUMMY_HASH...")
start = time.time()
try:
    result = verify_password("wrongpassword", DUMMY_HASH)
    print(f"Verification done in {time.time() - start:.4f}s. Result: {result}")
except Exception as e:
    print(f"Verification failed: {e}")
