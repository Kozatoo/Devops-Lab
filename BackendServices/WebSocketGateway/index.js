const express = require('express');
// const kafka = require('kafka-node');
const { Kafka } = require('kafkajs')
const port = 3000;
const app = express();

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
const kafka = new Kafka({
    clientId: "WebSocketsGateway",
    //Todo import brokers list and insert it here 
    brokers: ['kafka:9092']
})

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', async client => {
    const UserName = "Aziz"
    //todo set user topic to usrname from jwt payload
    const user_topic = "AzizBouaouina",connections_topic= "connections",messages_topic="messages" ;
    const consumer = kafka.consumer({groupId : "aziz"});
    const connectionWatcher = kafka.producer();
    await connectionWatcher.connect();
    await connectionWatcher.send({
        topic: connections_topic,
        message:[ 
            {value: UserName + "has connected"}
        ]
    })

    await consumer.connect();
    await consumer.subscribe({ topics: [user_topic]})

    await consumer.run({
        eachMessage: async ({ user_topic, partition, message, heartbeat, pause }) => {
            console.log("run ??",message)
            console.log(message.value.toString())
            client.emit('update', message.value.toString())
        },
    })

    client.on('send_message',async (data) =>{
        console.log("sending message", data)
        const producer = kafka.producer();

        await producer.connect();
        await producer.send({
            topic: user_topic,
            messages:[
                {value: data}
                    ]
        })
        console.log("message sent to user topic")
        await producer.send({
            topic: messages_topic,
            messages:[
                {value: data}
            ]
        })
        console.log("message sent to messages topic")
    });

    client.on('disconnect', async () => { 
        await connectionWatcher.send({
            topic: connections_topic,
            message:[ 
                {value: UserName + "has disconnected"}
            ]
        })
    });
});