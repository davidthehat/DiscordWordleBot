# syntax=docker/dockerfile:1
   
FROM node
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
EXPOSE 3000