import socket


def Main():
    host = 'localhost'
    port = 10111

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((host, port))

    while True:

        command = input('Insert command: ')

        if command == "exit" or command == "stop":
            s.send(command.encode('utf-8'))
            response = str(s.recv(1024).decode('utf-8'))

            if "CLSC" in response:
                break

        s.send(command.encode('utf-8'))
        response = str(s.recv(1024).decode('utf-8'))
        print(response)

    s.close()


Main()
