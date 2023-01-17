import React, { useState, useEffect } from "react";
import axios from "axios";
import UserStatus from "./userStatus";

function Sidebar(props) {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users`,
        {
          headers: {
            "x-access-token": JSON.parse(token),
          },
        }
      );
      const { data } = await response;
      console.log({ data });
      setUsers(data);
    }
    fetchUsers();
  }, []);

  return (
    <div className="bg-gray-200 p-4  overflow-y-auto h-screen">
      <h2 className="text-lg font-medium text-gray-800 mb-2">Conversations</h2>
      <ul className="list-none p-0 m-0">
        {" "}
        {users.map((user) => (
          <li
            onClick={() => {
              props.setSelectedUser(user);
            }}
            key={user.userid}
            className=" bg-gray-800 text-white p-2 rounded-lg m-1 flex justify-between"
          >
            <div className="justify-left">{user.username}</div>
            <UserStatus isConnected={user.isConnected} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
