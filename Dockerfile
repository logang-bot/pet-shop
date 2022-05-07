FROM node
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json .
RUN npm install --quiet
RUN npm install typescript -g --quiet
RUN npm install nodemon -g --quiet
RUN npm install express -g --quiet
RUN npm install ts-node -g --quiet
COPY . .
EXPOSE 8000
# Esta linea debe ejecutarse cuando la app este en desarrollo
CMD npm run dev
# Esta linea debe ejecutarse cuando la app este en produccion
# CMD npm run dev
