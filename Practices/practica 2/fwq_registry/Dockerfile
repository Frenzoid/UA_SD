FROM node

EXPOSE 9090

ENV FWQRPORT=9090
ENV DBNAME=parqueatracciones
ENV DBADDR=oldbox.cloud

WORKDIR /app

COPY ./ /app

RUN npm i

CMD ["npm", "run", "start:registry"]