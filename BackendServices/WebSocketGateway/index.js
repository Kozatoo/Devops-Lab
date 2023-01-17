const { json } = require("express");
const express = require("express");
const { Kafka } = require("kafkajs");
const jwt = require("jsonwebtoken");
const url = require("url");
const axios = require("axios");
const cors = require("cors");
const AUTH_SECRET_KEY = process.env.SECRET_KEY;

const port = 3000;
const app = express();
app.use(cors());
require("dotenv").config();

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
console.log(process.env);
const kafka = new Kafka({
  clientId: "WebSocketsGateway",
  //Todo import brokers list and insert it here
  brokers: [process.env.BROKER_URL],
});

app.get("/messages", async (req, res) => {
  const token = req.headers["x-access-token"];
  console.log("Fetching messages from websocket");
  jwt.verify(token, AUTH_SECRET_KEY, async (error, decoded) => {
    if (error) {
      res.status(401).send("Invalid token!");
    }
    const params = {
      firstUser: decoded.username,
      secondUser: req.query.user,
    };
    console.log(params);
    console.log(process.env.MESSAGE_SERVICE_URL + "messages");
    res.send(
      axios.get(process.env.MESSAGE_SERVICE_URL + "messages", { params })
    );
  });
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
io.of("/")
  .use((socket, next) => {
    console.log("User trying to connect ");
    console.log(socket);
    console.log(socket.handshake.query.token);
    console.log(socket.handshake.query);
    if (socket?.handshake?.query && socket?.handshake?.query?.token) {
      jwt.verify(
        socket.handshake.query.token,
        AUTH_SECRET_KEY,
        function (err, decoded) {
          if (err) {
            console.log("there was an error");
            return next(new Error("Authentication error"));
          }
          console.log("no error");
          socket.decoded = decoded;
          next();
        }
      );
    } else {
      console.log(err);
      console.logt("no socket info ");
      next(new Error("Authentication error"));
    }
  })
  .on("connection", async (socket) => {
    console.log("conneccctionnnnnnn", socket.id);
    const userName = socket.decoded.username;
    //todo set user_topic to username from jwt payload
    const user_topic = userName,
      connections_topic = "connections",
      messages_topic = "messages";
    const consumer = kafka.consumer({
      groupId: socket.id,
      allowAutoTopicCreation: true,
    });
    const connectionWatcher = kafka.producer();

    await connectionWatcher.connect();
    const connectedMessage = {
      user: userName,
      state: "Connected",
      socketId: socket.id,
    };
    await connectionWatcher.send({
      topic: connections_topic,
      messages: [{ value: JSON.stringify(connectedMessage) }],
    });

    await consumer.connect();
    await consumer.subscribe({ topics: [user_topic] });

    await consumer.run({
      eachMessage: async ({
        user_topic,
        partition,
        message,
        heartbeat,
        pause,
      }) => {
        message = JSON.parse(message.value);
        const newMessage = {
          from: message.from,
          value: message.value,
          to: message.to,
        };
        socket.emit("update", newMessage);
      },
    });

    socket.on("send_message", async (data) => {
      console.log("sendiiiinggg", socket.id);
      console.log({ data });
      //data = JSON.parse(data);
      const producer = kafka.producer();
      message = {
        from: userName,
        to: data.dest,
        value: data.value,
        sessionId: socket.id,
      };
      await producer.connect();

      await producer.send({
        topic: messages_topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    });

    socket.on("disconnect", async () => {
      console.log("disconnected");
      message = {
        user: userName,
        state: "Disconnected",
        socketId: socket.id,
      };
      await connectionWatcher.send({
        topic: connections_topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });
    });
  });
