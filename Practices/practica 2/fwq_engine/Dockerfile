FROM node:16.13.0

ENV WTSADDRESS=http://localhost:9222
ENV AFORO=10
ENV SECRET=ABRACADABRA
ENV DBNAME=parqueatracciones
ENV DBUSER=root
ENV DBPASS=root
ENV DBADDR=oldbox.cloud
ENV KAFKAADDRESS=oldbox.cloud:9092

WORKDIR /app

COPY ./ ./

RUN npm i

CMD ["npm", "start"]

# Para montar la image:
#   docker build -t sd:fwq_engine .

# Para exportar la imágen:
#   docker save -o fwq_engine.tar sd:fwq_engine

# Para importar la imágen:
#   docker load -i fwq_engine.tar

# Para arrancar el contenedor, si no se especifican las variables de entorno, se usan los valores por defecto.
#   docker run --name fwq_engine -it -e AFORO="" -e SECRET="" -e WTSADDRESS="" -e KAFKAADDRESS="" -e DBNAME="" -e DBADDR="" -e ATTRREQUESTTIME="" sd:fwq_engine
