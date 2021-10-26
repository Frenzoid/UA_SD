FROM node

ENV WTSADDRESS=http://localhost:9222
ENV AFORO=10
ENV SECRET=ABRACADABRA
ENV DBNAME=parqueatracciones
ENV DBADDR=oldbox.cloud
ENV KAFKAADDRESS=oldbox.cloud:9092

WORKDIR /app

COPY ./ ./

RUN npm i

CMD ["npm", "start"]

# Para montar la image:
#   docker build -t sd:fwq_engine .

# Para exportar la imágen:
#   docker save sd:fwq_engine > fwq_engine.tar

# Para importar la imágen:
#   docker load < fwq_engine.tar

# Para arrancar el contenedor, si no se especifican las variables de entorno, se usan los valores por defecto.
#   docker run --name fwq_engine -it -e AFORO="" -e SECRET="" -e WTSADDRESS="" -e DBNAME="" -e DBADDR="" sd:fwq_engine