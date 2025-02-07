# server.py
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socket

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def get_ip():
    hostname = socket.gethostname()
    return socket.gethostbyname(hostname)

PORT = 8000
server = HTTPServer(('0.0.0.0', PORT), Handler)
print(f"Server running at http://{get_ip()}:{PORT}")
server.serve_forever()