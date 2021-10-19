FROM node

EXPOSE 9111
EXPOSE 5000

ENV REGISTRYADDRESS=http://localhost:9090
ENV KAFKACONTROLLER=http://localhost:9111
ENV KAFKAADDRESS=oldbox.cloud:9092

WORKDIR /app

COPY ./build ./build
COPY ./kafkaWebSocket.js ./kafkaWebSocket.js

RUN npm install -g serve
RUN npm install kafka-node socket.io socket.io-client


CMD serve -C -s build & node kafkaWebSocket.js


# Antes de montar la imagen. buildeamos.
#   npm run build --production

# Para montar la image: 
#   docker build -t sd:fwq_visitor .

# Para arrancar el contenedor
#   sudo docker run --name fwq_visitor -it -e REGISTRYADDRESS="" -e KAFKACONTROLLER="" -e KAFKAADDRESS="" -p 80:5000 -p 9111:9111 sd:fwq_visitor