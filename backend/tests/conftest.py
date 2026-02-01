import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock
from app.main import app
from app.db.session import SessionManager, get_session

@pytest.fixture
def mock_session_manager():
    """
    Creates a mock SessionManager with a mock pg_session.
    This avoids connecting to the real database during tests.
    """
    mock_manager = MagicMock(spec=SessionManager)
    # mock pg_session as an AsyncMock since it's used in await calls or passed to async functions
    mock_manager.pg_session = AsyncMock() 
    return mock_manager

@pytest.fixture
async def override_get_session(mock_session_manager):
    """
    Overrides the get_session dependency to return the mock_session_manager.
    """
    async def _get_session_override():
        yield mock_session_manager
    
    app.dependency_overrides[get_session] = _get_session_override
    yield
    app.dependency_overrides = {} # Clean up after test

@pytest.fixture
async def async_client(override_get_session):
    """
    Creates an AsyncClient for testing the FastAPI app.
    Automatically applies the session override.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
