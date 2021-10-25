FROM node

EXPOSE 9111
EXPOSE 5000

ENV REGISTRYADDRESS=http://localhost:9090
ENV KAFKACONTROLLER=http://localhost:9111
ENV KAFKAADDRESS=oldbox.cloud:9092
ENV SECRET=ABRACADABRA

WORKDIR /app

COPY ./ ./
RUN chmod +x grabenv.sh

RUN npm install -g serve concurrently
RUN yarn install

CMD ./grabenv.sh && concurrently "npm start" "node kafkaController.js"

# Para montar la image:
#   docker build -t sd:fwq_visitor .

# Para exportar la imágen:
#   docker save sd:fwq_visitor > fwq_visitor.tar

# Para importar la imágen:
#   docker load < fwq_visitor.tar

# Para arrancar el contenedor
#   docker run --name fwq_visitor -it -e REGISTRYADDRESS="" -e KAFKACONTROLLER="" -e KAFKAADDRESS="" -p 5000:5000 -p 9111:9111 sd:fwq_visitor