const { json } = require('express');
const express = require('express');
const { Kafka } = require('kafkajs')
const port = 3000;
const app = express();
require('dotenv').config();

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
console.log(process.env)
const kafka = new Kafka({
    clientId: "WebSocketsGateway",
    //Todo import brokers list and insert it here 
    brokers: [process.env.BROKER_URL]
})

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
// io.on("")
io.on('connection', async socket => {
    const userName = "Aziz"
    //todo set user_topic to username from jwt payload
    const user_topic = socket.id ,connections_topic= "connections",messages_topic="messages" ;
    const consumer = kafka.consumer({groupId : user_topic, allowAutoTopicCreation: true});
    const connectionWatcher = kafka.producer();

    await connectionWatcher.connect();
    const connectedMessage = {
        user: userName,
        state: "Connected",
        socketId: socket.id
        }    
    await connectionWatcher.send({
        topic: connections_topic,
        messages:[ 
            { value: JSON.stringify(connectedMessage) }
        ]
    })

    await consumer.connect();
    await consumer.subscribe({ topics: [user_topic]})

    await consumer.run({
        eachMessage: async ({ user_topic, partition, message, heartbeat, pause }) => {
            message = JSON.parse(message.value)
            const newMessage = {
                from : message.from,
                value: message.value,
                to: message.to 
            }
            socket.emit("update", newMessage)
        },
    })

    socket.on('send_message',async (data) =>{
        console.log("producer socket id " + socket.id)
        console.log(data);
        console.log(JSON.parse(data))
        data = JSON.parse(data)
        const producer = kafka.producer();
        message = {
            from: userName,
            to: data.dest,
            value: data.value
        }
        await producer.connect();
        await producer.send({
            topic: user_topic,
            messages:[
                {value: JSON.stringify(message)}
                    ]
        })

        console.log("message sent to "+ user_topic)
        await producer.send({
            topic: messages_topic,
            messages:[
                {value: JSON.stringify(message)}
            ]
        })
        console.log("message sent to "+ messages_topic)
    });

    socket.on('disconnect', async () => { 
        console.log("disconnected")
        message = {
            user: userName,
            state: "Disconnected",
            socketId: socket.id
            }
        await connectionWatcher.send({
            topic: connections_topic,
            messages:[ 
                {
                    value: JSON.stringify(message)
                }
            ]
        })
    });
});