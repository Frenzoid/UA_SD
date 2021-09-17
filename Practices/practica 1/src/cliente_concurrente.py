import socket
import sys

def Main():
    
    if len(sys.argv) < 2:
        print("Port not specified!")
        exit()

    host = 'localhost'
    port = int(sys.argv[1])
    
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((host, port))
    

    while True:

        command = input('Insert command: ')

        if command == "exit":
            s.send(command.encode('utf-8'))
            response = str(s.recv(1024).decode('utf-8'))

            if "CLSC" in response:
                break

        s.send(command.encode('utf-8'))
        response = str(s.recv(1024).decode('utf-8'))
        print(response)

    s.close()


Main()
