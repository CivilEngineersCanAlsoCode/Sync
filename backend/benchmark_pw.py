
import time
from app.core.security import verify_password, get_password_hash

def benchmark():
    password = "Microsoft!098"
    print(f"Hashing password...")
    start = time.time()
    hashed = get_password_hash(password)
    print(f"Hashed in {time.time() - start:.4f}s")
    
    print(f"Verifying password...")
    start = time.time()
    match, new_hash = verify_password(password, hashed)
    print(f"Verified in {time.time() - start:.4f}s. Match: {match}")

if __name__ == "__main__":
    benchmark()
