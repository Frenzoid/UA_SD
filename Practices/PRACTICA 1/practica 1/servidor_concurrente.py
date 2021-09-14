# import socket programming library
import socket
import os
import threading
from _thread import *

lock = threading.Lock()


def threaded(c):
    while True:

        command = str(c.recv(1024).decode('utf-8'))

        if command == "exit":
            print("Closing Connection.")
            c.send("CLSC001".encode('utf-8'))
            c.close()
            lock.release()
            break

        if command == "stop":
            print("Closing Server.")
            c.send("CLSC002".encode('utf-8'))
            c.close()
            lock.release()
            break

        try:
            response = os.popen(command).read()
            print(response)
            c.send(response.encode('utf-8'))
        except ValueError:
            print(ValueError)
            c.send("An issue happend while executing your command.".encode('utf-8'))


def Main():
    host = "localhost"
    port = 10111

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    s.bind((host, port))
    print("Socket binded to port: ", port)

    s.listen(5)
    print("Socket in listening mode!")

    while True:
        lock.acquire()
        c, addr = s.accept()
        print('Connection incomming from:', addr[0], ':', addr[1])
        start_new_thread(threaded, (c,))


Main()
