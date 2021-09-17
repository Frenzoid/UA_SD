import socket
import os
import sys
from _thread import start_new_thread


def clientProcess(c):
    while True:

        command = str(c.recv(1024).decode('utf-8'))

        if command == "exit":
            print("Closing Connection.")
            c.send("CLSC001".encode('utf-8'))
            c.close()
            break

        try:
            response = run(command)
            print(response)
            c.send(response.encode('utf-8'))
        except ValueError:
            print(ValueError)
            c.send("An issue happend while executing your command.".encode('utf-8'))


def Main():

    if len(sys.argv) < 2:
        print("Port not specified!")
        exit()

    host = 'localhost'
    port = int(sys.argv[1])
    
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    s.bind((host, port))
    print("Socket binded to port: ", port)

    s.listen(5)
    print("Socket in listening mode!")


    while True:
        c, addr = s.accept()
        print('New connection incomming from:', addr[0], ':', addr[1])
        start_new_thread(clientProcess, (c,))


def run(command):
    return os.popen(command).read() or "Command: '" + command + "' executed. Yet, no output was returned."


Main()
