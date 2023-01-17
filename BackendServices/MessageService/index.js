const { json } = require("express");
const express = require("express");
const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const port = 3001;
const app = express();

mongoose.connect(process.env.MESSAGES_DB, { useNewUrlParser: true });
const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  value: String,
});
const Message = mongoose.model("Message", messageSchema);

app.get("/messages", async (req, res) => {
  console.log("Fetching messages from message handler ");
  console.log({ query: req.query });
  const messages = await Message.find({
    $or: [
      { $and: [{ from: req.query.firstUser }, { to: req.query.secondUser }] },
      {
        $and: [{ to: req.query.firstUser }, { from: req.query.secondUser }],
      },
    ],
  });
  console.log({ messages });
  if (!messages) return res.status(400);
  return res.send(messages).status(200);
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
const kafka = new Kafka({
  clientId: "MessageManager",
  //Todo import brokers list and insert it here
  brokers: [process.env.BROKER_URL],
});

const groupId = "test";
const messageHandlerTopic = "messages";

const consumer = kafka.consumer({
  groupId: groupId,
  allowAutoTopicCreation: true,
});
const producer = kafka.producer();
async function run() {
  await producer.connect();

  await consumer.connect();
  await consumer.subscribe({ topics: [messageHandlerTopic] });

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

      //store message in db
      // Create a new message
      const messageToSave = new Message({
        from: message.from,
        to: message.to,
        value: message.value,
      });
      // Save the message to the database
      messageToSave.save((error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("message saved successfully!");
        }
      });

      //send message to sender
      await producer.send({
        topic: message.from,
        messages: [{ value: JSON.stringify(newMessage) }],
      });
      console.log(`sent message to ${message.from}`);
      //send message to receiver
      await producer.send({
        topic: message.to,
        messages: [{ value: JSON.stringify(newMessage) }],
      });
      console.log(`sent message to ${message.to}`);
    },
  });
}
run().catch(console.error);
