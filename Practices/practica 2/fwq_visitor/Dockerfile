FROM node

EXPOSE 9111
EXPOSE 5000

ENV REACT_APP_REGISTRYADDRESS=http://localhost:9090
ENV REACT_APP_KAFKACONTROLLER=http://localhost:9111
ENV REACT_APP_KAFKAADDRESS=oldbox.cloud:9092
ENV REACT_APP_SECRET=ABRACADABRA

WORKDIR /app

COPY ./ ./

RUN npm install -g serve concurrently
RUN yarn install

CMD npm run build && concurrently "serve -C -s build" "node kafkaController.js"

# Para montar la image:
#   docker build -t sd:fwq_visitor .

# Para exportar la imágen:
#   docker save sd:fwq_visitor > fwq_visitor.tar

# Para importar la imágen:
#   docker load < fwq_visitor.tar

# Para arrancar el contenedor
#   docker run --name fwq_visitor -it -e REACT_APP_REGISTRYADDRESS="" -e REACT_APP_KAFKACONTROLLER="" -e REACT_APP_KAFKAADDRESS="" -p 5000:5000 -p 9111:9111 sd:fwq_visitor