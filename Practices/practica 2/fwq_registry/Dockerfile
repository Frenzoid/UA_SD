FROM node

EXPOSE 9090

ENV FWQRPORT=9090
ENV DBNAME=parqueatracciones
ENV DBADDR=oldbox.cloud

WORKDIR /app

COPY ./ /app

RUN npm i

CMD ["npm", "run", "start:registry"]

# Para montar la image: 
#   docker build -t sd:fwq_registry .

# Para arrancar el contenedor
#   sudo docker run --name fwq_registry -it -e FWQRPORT="" -e DBNAME="" -e DBADDR="" -p 9090:9090 sd:fwq_registry