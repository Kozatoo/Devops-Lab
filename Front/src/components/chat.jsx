import React, { useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useAuth } from "../Context/AuthProvider";

function Chat({ user, socket }) {
  const { user: userCon } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("update", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  useEffect(() => {
    async function getMessages() {
      const response = await axios.get("http://localhost:3001/messages", {
        params: {
          firstUser: user.username,
          secondUser: userCon.username,
        },
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("token")),
        },
      });
      const { data } = response;
      setMessages(data);
    }
    getMessages();
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    console.log({ socket });
    socket.emit("send_message", {
      dest: user.username,
      value: message,
      time: new Date().getTime(),
    });
    event.target.elements.message.value = "";
  };
  return (
    <div className="bg-gray-200 p-4">
      <h2 className="text-lg font-medium text-gray-800 mb-2">
        {user.username} : {user.user_id}
      </h2>
      <div className="overflow-y-auto h-screen">
        {messages.length && (
          <ul>
            {messages.map((message) => (
              <li
                key={message.id}
                className={`text-gray-800 ${
                  message.sender === user.username
                    ? "bg-blue-200 text-left"
                    : "bg-gray-300 text-right"
                }`}
              >
                <div className="font-medium">
                  {message.from === user.username ? user.username : "You"}:
                </div>
                {message.value}
              </li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          name="message"
          className="bg-gray-200 p-2 rounded-lg w-full"
          placeholder="Type your message here..."
        />
        <button type="submit" className="p-2 rounded-lg bg-blue-500 text-white">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
