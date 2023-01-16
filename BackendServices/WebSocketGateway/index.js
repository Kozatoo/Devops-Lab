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
    await connectionWatcher.send({
        topic: connections_topic,
        messages:[ 
            {value: `${userName} has connected`}
        ]
    })

    await consumer.connect();
    await consumer.subscribe({ topics: [user_topic]})

    await consumer.run({
        eachMessage: async ({ user_topic, partition, message, heartbeat, pause }) => {
            socket.emit("update", message.value.toString())
        },
    })

    socket.on('send_message',async (data) =>{
        console.log("producer socket id " + socket.id)
        const producer = kafka.producer();

        await producer.connect();
        await producer.send({
            topic: user_topic,
            messages:[
                {value: data}
                    ]
        })
        console.log("message sent to "+ user_topic)
        await producer.send({
            topic: messages_topic,
            messages:[
                {value: data}
            ]
        })
        console.log("message sent to "+ messages_topic)
    });

    socket.on('disconnect', async () => { 
        console.log("disconnected")
        await connectionWatcher.send({
            topic: connections_topic,
            messages:[ 
                {value:`${userName} has disconnected`}
            ]
        })
    });
});