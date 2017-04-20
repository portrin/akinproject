#!/usr/local/bin/python3
import http.server

PORT = 8000
Handler = http.server.CGIHTTPRequestHandler

Address = ('', PORT)

SERVER = http.server.HTTPServer(Address, Handler)

print("serving at port" , PORT)
SERVER.serve_forever()

