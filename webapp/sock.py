#!/usr/local/bin/python3
import http.server
import socketserver
import urllib

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler
"""
class Handler(http.server.SimpleHTTPRequestHandler):
    
    def do_GET(self):  
        query = urllib.parse.urlparse(self.path).query
        print(query) 

class MyTCPHandler(socketserver.BaseRequestHandler):
    """
    
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever() 
