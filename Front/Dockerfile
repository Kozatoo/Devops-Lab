FROM node
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
## EXPOSE [Port you mentioned in the vite.config file]
CMD ["npm", "run", "dev"]
EXPOSE 5173