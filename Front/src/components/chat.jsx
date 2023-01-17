import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    async function getMessages() {
      const response = await axios.get(
        "https://mocki.io/v1/aade820c-a92c-4dbd-ab9f-226f6803325f"
      );
      const { data } = response;
      setMessages(data);
    }
    getMessages();
  }, []);
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
                  message.sender === user.user_id
                    ? "bg-blue-200 text-left"
                    : "bg-gray-300 text-right"
                }`}
              >
                <div className="font-medium">
                  {message.sender === user.user_id ? user.username : "You"}:
                </div>
                {message.payload}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        className="bg-gray-200 p-2 rounded-lg w-full"
        placeholder="Type your message here..."
      />
    </div>
  );
}

export default Chat;
