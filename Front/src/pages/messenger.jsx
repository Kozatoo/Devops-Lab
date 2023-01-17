import React, { useState } from "react";
import Sidebar from "../components/sideBar";
import Chat from "../components/chat";

function Messenger() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Sidebar setSelectedUser={setSelectedUser} />
      {selectedUser && <Chat user={selectedUser} />}
    </div>
  );
}

export default Messenger;
