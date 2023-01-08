# Devops-Lab
This is a DevOps Lab that is centered around building a real-time chat application that is deployed and managed independently using tools such as Kubernetes and Helm. Monitoring tools such as Prometheus and Grafana can be used to track the performance and availability of the services.  

The real-time chat application is a web-based messaging platform that allows users to send and receive messages in real-time. It consists of a frontend service, which is a web application that serves that establishes websocket connections to the backend services, and a backend services, which is a websocket server that handles real-time communication between the frontend and the backend. The backend service stores and retrieves messages from a database and broadcasts them to all connected clients.  
  <hr>
The backend is decomposed into multiple microservices: 

1- A "message service" that stores and retrieves messages from a database.

2- A "notification service" that sends notifications to connected clients when new messages are received.

3- A "presence service" that keeps track of which clients are currently connected and available for messaging.

4- A "profile service" that stores and retrieves user profile data

5- An "authentication service" that authenticates users and authorizes their access to certain resources or actions.