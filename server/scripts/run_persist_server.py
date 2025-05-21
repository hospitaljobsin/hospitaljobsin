import json
from hashlib import md5
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs

import structlog

FILE_MAP_NAME = "query_map.json"


class QueryMap:
    def __init__(self, file_map_name: Path) -> None:
        self.file_map_name = file_map_name
        # Check if the file exists; if not, create an empty JSON file
        if Path.exists(self.file_map_name):
            with Path.open(self.file_map_name, "r") as file:
                self.query_map = json.load(file)
        else:
            self.query_map = {}
            self._flush()  # Create the file with an empty dictionary if it doesn't exist

    def _flush(self) -> None:
        with Path.open(self.file_map_name, "w") as file:
            json.dump(self.query_map, file)

    def save_query(self, text: str) -> str:
        query_id = md5(text.encode()).hexdigest()  # noqa: S324
        self.query_map[query_id] = text
        self._flush()
        return query_id


query_map = QueryMap(Path(FILE_MAP_NAME))


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self) -> None:  # noqa: N802
        if self.headers.get("Content-Type") != "application/x-www-form-urlencoded":
            self.send_response(400)
            self.end_headers()
            self.wfile.write(
                b'Only "application/x-www-form-urlencoded" requests are supported.'
            )
            return

        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length).decode()
        params = parse_qs(post_data)
        text = params.get("text", [None])[0]

        if text is None:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"Expected to have `text` parameter in the POST.")
            return

        query_id = query_map.save_query(text)
        response = json.dumps({"id": query_id}).encode()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(response)


if __name__ == "__main__":
    logger = structlog.get_logger(__name__)
    PORT = 2999
    server = HTTPServer(("127.0.0.1", PORT), SimpleHTTPRequestHandler)
    logger.info(f"Persisted Queries server listening on port {PORT}")  # noqa: G004
    server.serve_forever()
