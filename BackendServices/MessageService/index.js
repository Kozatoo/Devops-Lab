const { json } = require('express');
const express = require('express');
const { Kafka } = require('kafkajs')
const port = 3001;
const app = express();

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
const kafka = new Kafka({
    clientId: "MessageManager",
    //Todo import brokers list and insert it here 
    brokers: [process.env.BROKER_URL]
})

const groupId = "messageHandler";
const messageHandlerTopic = "messages";

const consumer = kafka.consumer({groupId : groupId, allowAutoTopicCreation: true});
const producer = kafka.producer();
async function run(){
    await producer.connect();

    await consumer.connect();
    await consumer.subscribe({ topics: [messageHandlerTopic]})

    await consumer.run({
        eachMessage: async ({ user_topic, partition, message, heartbeat, pause }) => {
            message = JSON.parse(message.value)
            const newMessage = {
                from : message.from,
                value: message.value,
                to: message.to 
            }
            //store message in db
            
            console.log(newMessage)
            //send message to sender 
            await producer.send({
                topic: message.from,
                messages:[
                    {value: JSON.stringify(newMessage)}
                        ]
            })
            //send message to receiver
            await producer.send({
                topic: message.dest,
                messages:[
                    {value: JSON.stringify(newMessage)}
                        ]
            })
            console.log(`sent message to ${message.sessionId}`)
        },
    })
}
run().catch(console.error);