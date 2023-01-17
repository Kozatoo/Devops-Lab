import React from "react";
import { FaCircle } from "react-icons/fa";

function UserStatus({ isConnected }) {
  return (
    <span className="ml-2">
      {isConnected ? (
        <FaCircle className="text-green-500" />
      ) : (
        <FaCircle className="text-red-500" />
      )}
    </span>
  );
}

export default UserStatus;
