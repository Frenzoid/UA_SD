FROM node

EXPOSE 9111

ENV REGISTRYADDRESS=http://localhost:9090
ENV KAFKACONTROLLER=http://localhost:9111
ENV KAFKAADDRESS=oldbox.cloud:9092

WORKDIR /app

COPY ./build /app/build
COPY ./kafkaWebSocket.js /app/kafkaWebSocket.js

RUN npm i -g yarn concurrently
RUN yarn global add serve

CMD ["concurrently", '"serve -s build"', '"node kafkaWebSocket.js"']