import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.security import encrypt_value, decrypt_value, get_encryption_key

def test_encryption():
    test_str = "Lesión de rodilla, Diabetes"
    encrypted = encrypt_value(test_str)
    print(f"Original: {test_str}")
    print(f"Encrypted: {encrypted}")
    
    decrypted = decrypt_value(encrypted)
    print(f"Decrypted: {decrypted}")
    
    assert test_str == decrypted
    print("Encryption/Decryption verification SUCCESS!")

if __name__ == "__main__":
    test_encryption()
