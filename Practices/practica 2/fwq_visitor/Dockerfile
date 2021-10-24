FROM node

EXPOSE 9111
EXPOSE 5000

ENV REGISTRYADDRESS=http://localhost:9090
ENV KAFKACONTROLLER=http://localhost:9111
ENV KAFKAADDRESS=oldbox.cloud:9092
ENV SECRET=ABRACADABRA

WORKDIR /app

COPY ./ ./

RUN npm install -g serve concurrently
RUN npm install kafka-node socket.io socket.io-client socket.io-encrypt react-scripts

RUN npm run build --production

CMD concurrently "serve -C -s build" "node kafkaController.js"

# Para montar la image:
#   docker build -t sd:fwq_visitor .

# Para exportar la imágen:
#   docker save sd:fwq_visitor > fwq_visitor.tar

# Para importar la imágen:
#   docker load < fwq_visitor.tar

# Para arrancar el contenedor
#   sudo docker run --name fwq_visitor -it -e REGISTRYADDRESS="" -e KAFKACONTROLLER="" -e KAFKAADDRESS="" -p 80:5000 -p 9111:9111 sd:fwq_visitor