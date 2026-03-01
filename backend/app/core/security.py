from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
import base64
import anyio
from app.core.config import settings

# Contexto para hashing de passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_encryption_key():
    """Deriva una key válida para Fernet desde la SECRET_KEY"""
    # Fernet necesita 32 bytes url-safe base64. 
    # Usamos settings.SECRET_KEY. Aseguramos 32 bytes padding o truncando.
    key = settings.SECRET_KEY
    if len(key) < 32:
        key = key.ljust(32, '0') # Padding simple
    else:
        key = key[:32]
    return base64.urlsafe_b64encode(key.encode())

cipher_suite = Fernet(get_encryption_key())

def encrypt_value(value: str) -> str:
    """Encripta un valor string"""
    if not value:
        return value
    return cipher_suite.encrypt(value.encode()).decode()

def decrypt_value(value: str) -> Optional[str]:
    """Desencripta un valor string"""
    if not value:
        return value
    try:
        return cipher_suite.decrypt(value.encode()).decode()
    except Exception:
        # Si falla (ej. dato no encriptado previamente), retornamos el valor original o None
        return value


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar si una contraseña coincide con el hash.
    Ejecuta bcrypt en un hilo separado para no bloquear el event loop.
    """
    return await anyio.to_thread.run_sync(
        lambda: pwd_context.verify(plain_password, hashed_password)
    )


async def get_password_hash(password: str) -> str:
    """Hashear una contraseña.
    Ejecuta bcrypt en un hilo separado para no bloquear el event loop.
    """
    return await anyio.to_thread.run_sync(
        lambda: pwd_context.hash(password)
    )


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crear un token JWT
    
    Args:
        data: Datos a codificar en el token
        expires_delta: Tiempo de expiración del token
    
    Returns:
        Token JWT codificado
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodificar un token JWT
    
    Args:
        token: Token JWT a decodificar
    
    Returns:
        Datos del token o None si es inválido
    """
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
