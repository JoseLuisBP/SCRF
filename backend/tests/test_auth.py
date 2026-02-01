import pytest
from unittest.mock import AsyncMock, patch
from app.schemas.token import Token

@pytest.mark.asyncio
async def test_register_user_success(async_client):
    """
    Test successful user registration.
    Mocks AuthService to avoid actual database interaction.
    """
    # Test data
    user_data = {
        "nombre": "Usuario Prueba",
        "correo": "test@example.com",
        "contrasena": "password123",
        "edad": 30,
        "peso": 80.0,
        "estatura": 180,
        "nivel_fisico": "Principiante",
        "tiempo_disponible": 60
    }

    # API Response expectation
    mock_token = Token(
        access_token="mocked_access_token",
        token_type="bearer",
        expires_in=3600
    )

    # Patch AuthService methods
    # we patch 'app.api.v1.auth.AuthService' because that's where it is imported/used in the router
    with patch("app.api.v1.auth.AuthService.register_user", new_callable=AsyncMock) as mock_register, \
         patch("app.api.v1.auth.AuthService.create_token") as mock_create_token:
        
        # Setup mocks
        mock_register.return_value = AsyncMock(id_usuario=1, correo="test@example.com") # Mock User object
        mock_create_token.return_value = mock_token

        # Execute request
        response = await async_client.post("/api/v1/auth/register", json=user_data)

        # Assertions
        assert response.status_code == 201
        data = response.json()
        assert data["access_token"] == "mocked_access_token"
        assert data["token_type"] == "bearer"
        
        # Verify mocked service was called
        mock_register.assert_called_once()
        mock_create_token.assert_called_once()
