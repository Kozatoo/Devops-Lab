import React, { useContext, useState } from "react";
import Sidebar from "../components/sideBar";
import Chat from "../components/chat";
import { useSocket } from "../Context/SocketContext";
import { useAuth } from "../Context/AuthProvider";

function Messenger() {
  const [selectedUser, setSelectedUser] = useState(null);
  const socket = useSocket();
  const { user } = useAuth();

  return (
    <>
      <h1>{user.username}</h1>
      <div className="grid grid-cols-2 gap-4">
        <Sidebar setSelectedUser={setSelectedUser} />
        {selectedUser && <Chat socket={socket} user={selectedUser} />}
      </div>
    </>
  );
}

export default Messenger;
