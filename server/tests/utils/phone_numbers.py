import threading


class PhoneNumberGenerator:
    """Thread-safe sequential phone number generator."""

    def __init__(self) -> None:
        self._counter = 0
        self._lock = threading.Lock()

    def get_next_number(self) -> int:
        """Get the next sequential number in a thread-safe way."""
        with self._lock:
            self._counter += 1
            return self._counter


# Global instance
_phone_generator = PhoneNumberGenerator()


def generate_test_phonenumber() -> str:
    """Generate a unique sequential test phone number."""
    # Generate a sequential 10-digit phone number starting from 9000000001
    sequential_num = _phone_generator.get_next_number()
    # Ensure we stay within valid Indian mobile number range (9000000001 to 9999999999)
    phone_suffix = 9000000000 + (sequential_num % 1000000000)
    return f"+91{phone_suffix}"
