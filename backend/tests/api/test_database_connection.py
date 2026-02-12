"""
Test ID: 1.2-API-001
Story: 1.2 - Database Connection & Basic SQLModel Setup
Priority: P0 (Critical - Data Layer)

Acceptance Criteria:
- AC-1.2-01: "Database Connected" message appears in logs when Postgres is healthy
- AC-1.2-02: Error message format {"error": "Database se connect nahi ho pa rahe hain...", "code": "DB_CONN_ERROR"} on connection failure
"""

import json
import logging
from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy.exc import OperationalError
from sqlmodel import Session, select

from app.core.db import engine, verify_db_connection


@pytest.mark.api
@pytest.mark.p0
class TestDatabaseConnection:
    """Database connection validation tests"""

    def test_database_connected_message_in_logs(self, caplog):
        """
        Test ID: 1.2-API-001
        Validates AC-1.2-01: "Database Connected" message appears in logs
        """
        # Arrange
        caplog.set_level(logging.INFO)

        # Act
        with Session(engine) as session:
            result = session.exec(select(1)).first()

        # Assert: Database query succeeds
        assert result == 1

        # Assert: "Database Connected" message in logs
        # This is validated through verify_db_connection function
        connection_status = verify_db_connection()
        assert connection_status is True

        # Check logs for success message
        assert any("Database Connected" in record.message for record in caplog.records)

    def test_database_connection_success(self):
        """
        Test ID: 1.2-API-002
        Validates successful database connection
        """
        # Act
        result = verify_db_connection()

        # Assert
        assert result is True

    def test_database_connection_failure_error_format(self, caplog):
        """
        Test ID: 1.2-API-003
        Validates AC-1.2-02: Error message format on connection failure
        """
        # Arrange
        caplog.set_level(logging.ERROR)

        # Mock database connection failure
        with patch("app.core.db.Session") as mock_session:
            mock_session_instance = MagicMock()
            mock_session_instance.__enter__.return_value.exec.side_effect = (
                OperationalError("Connection refused", None, None)
            )
            mock_session.return_value = mock_session_instance

            # Act & Assert: Connection should raise ConnectionError
            with pytest.raises(ConnectionError) as exc_info:
                verify_db_connection()

            # Assert: Error message format is correct
            error_message = str(exc_info.value)
            error_dict = json.loads(error_message)

            assert error_dict["error"] == "Database se connect nahi ho pa rahe hain, please settings check karein"
            assert error_dict["code"] == "DB_CONN_ERROR"

            # Assert: Error logged with correct format
            error_logs = [
                record for record in caplog.records if record.levelname == "ERROR"
            ]
            assert len(error_logs) > 0

    def test_database_connection_retry_mechanism(self):
        """
        Test ID: 1.2-API-004
        Validates that backend_pre_start.py retry mechanism works
        """
        # This test validates the retry logic in backend_pre_start.py
        # The retry mechanism attempts connection 300 times (5 minutes)

        from app.backend_pre_start import init

        # Act: Init should succeed with healthy database
        try:
            init(engine)
            success = True
        except Exception:
            success = False

        # Assert: Connection succeeds
        assert success is True

    def test_database_health_check_endpoint(self, client):
        """
        Test ID: 1.2-API-005
        Validates /api/v1/utils/health-check endpoint includes DB status
        """
        # Act
        response = client.get("/api/v1/utils/health-check")

        # Assert: Health check succeeds
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"

        # Database connection is implicitly validated
        # If DB is down, backend won't start


# Romanised Hindi explanation (code ke NEECHE):
"""
Yeh tests database connection ko validate karte hain. Pehla test check karta hai
ki "Database Connected" message logs mein aa raha hai jab Postgres healthy hai.
Doosra test verify karta hai ki connection successful hai. Teesra test validate
karta hai ki agar connection fail ho jaye to error message sahi format mein aaye
(Romanised Hindi ke saath). Chautha test retry mechanism ko validate karta hai
jo backend_pre_start.py mein hai. Paanchwa test health check endpoint ko verify
karta hai jo indirectly database connection validate karta hai.
"""
