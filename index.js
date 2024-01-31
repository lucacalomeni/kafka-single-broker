/**
 * This script initializes a Kafka producer and consumer using the kafkajs library in a Node.js environment.
 * It demonstrates basic functionalities such as producing and consuming messages to and from a Kafka topic.
 * The script also sets up an Express.js server to listen on a specified port.
 *
 * Dependencies:
 * - express: Used for setting up the HTTP server.
 * - kafkajs: Kafka client library for Node.js.
 *
 * Usage:
 * - Ensure that the necessary dependencies are installed by running: `npm install express kafkajs`
 * - Update the Kafka broker information and topic names as needed.
 * - Execute the script using Node.js: `node script.js`
 *
 * Note: This script assumes that a Kafka broker is available at 'broker:9092'.
 */
const express = require('express');
const { Kafka } = require('kafkajs');

(async () => {
  console.log("Initializing kafka...");
  const kafka = new Kafka({
    clientId: '1',
    brokers: ['localhost:9092'],
  });
  
  // Initialize the Kafka producer and consumer
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: 'my-topic-1-consumer-group' });

  await producer.connect();
  console.log("Connected to producer.");
  
  await consumer.connect();
  console.log("Connected to consumer.");
  
  
  await consumer.subscribe({ topic: 'my-topic-1', fromBeginning: true });
  console.log("Consumer subscribed to topic = my-topic-1");

  // Log every message consumed
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      console.log(
        'Consumed a message = ',
        { topic, partition, value: message.value.toString() }
      )
    },
  });
  
  const app = express();
  
  const PORT = process.env.PORT || 3001;

  app.get('/topics', async (req, res) => {
    res.send('Produced a message.')
      // Send an event to the my-topic-1 topic
    await producer.send({
        topic: 'my-topic-1',
        messages: [
        { value: 'Event my-topic-1' },
        ],
    });
    console.log("Produced a message.");
    // Disconnect the producer once we’re done
    await producer.disconnect();
  })

  app.listen(PORT, () => {
    console.log(`🎉🎉🎉 Application running on port: ${PORT} 🎉🎉🎉`);
  });
})();