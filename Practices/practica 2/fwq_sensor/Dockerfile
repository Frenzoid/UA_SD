FROM node

ENV IDATTR=0
ENV X=14
ENV Y=3
# IMAGEN ( Optativo )
ENV KAFKAADDRESS=oldbox.cloud:9092

WORKDIR /app

COPY ./ /app

RUN npm i

CMD ["npm", "start"]

# Para montar la image:
#   docker build -t sd:fwq_sensor .

# Para exportar la imágen:
#   docker save sd:fwq_sensor > fwq_sensor.tar

# Para importar la imágen:
#   docker load < fwq_sensor.tar

# Para arrancar el contenedor, si no se especifican las variables de entorno, se usan los valores por defecto.
#   docker run --name fwq_sensor -it -e IDATTR="" -e X="" -e Y="" -e KAFKAADDRESS="" -e IMAGEN="" sd:fwq_sensor