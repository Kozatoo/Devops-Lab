from flask import Flask, send_from_directory, make_response
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit
from kafka import KafkaProducer, KafkaConsumer, TopicPartition
import uuid

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

BOOTSTRAP_SERVERS = 'kafka:9092'
TOPIC_NAME = 'stackbox'


@app.route('/')
@cross_origin()
def home():
    print("reached main base")
    return make_response("Hello Hello")

""" Kafka endpoints """


@socketio.on('connect', namespace='/kafka')
def test_connect():
    #getting old messages in the same topic
    #TODO Get them from http request from messaging microservices
    consumer = KafkaConsumer(group_id='consumer-1',
                             bootstrap_servers=BOOTSTRAP_SERVERS)
    tp = TopicPartition(TOPIC_NAME, 0)
    # register to the topic
    consumer.assign([tp])

    # obtain the last offset value
    consumer.seek_to_end(tp)
    lastOffset = consumer.position(tp)
    consumer.seek_to_beginning(tp)
    emit('kafkaconsumer1', {'data': ''})
    for message in consumer:
        emit('kafkaconsumer', {'data': message.value.decode('utf-8')})
        if message.offset == lastOffset - 1:
            break
    
    consumer.close()
    emit('logs', {'data': 'Connection established'})


@socketio.on('kafkaconsumer', namespace="/kafka")
def kafkaconsumer(message):
    consumer = KafkaConsumer(group_id='consumer-1',
                             bootstrap_servers=BOOTSTRAP_SERVERS)
    tp = TopicPartition(TOPIC_NAME, 0)
    # register to the topic
    consumer.assign([tp])

    # obtain the last offset value
    consumer.seek_to_end(tp)
    lastOffset = consumer.position(tp)
    consumer.seek_to_beginning(tp)
    
    for message in consumer:
        emit('kafkaconsumer', {'data': message.value.decode('utf-8')})
        if message.offset == lastOffset - 1:
            break
    consumer.close()


@socketio.on('kafkaproducer', namespace="/kafka")
def kafkaproducer(message):
    print(message)
    print(TOPIC_NAME)
    print(BOOTSTRAP_SERVERS)
    producer = KafkaProducer(bootstrap_servers=BOOTSTRAP_SERVERS,  api_version=(0, 10, 1))
    print("created")
    print(message)
    producer.send(TOPIC_NAME, value=bytes(str(message), encoding='utf-8'), key=bytes(str(uuid.uuid4()), encoding='utf-8'))
    print("sent")
    emit('logs', {'data': 'Added ' + message + ' to topic'})
    emit('kafkaproducer', {'data': message})
    producer.close()
    kafkaconsumer(message)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001)
