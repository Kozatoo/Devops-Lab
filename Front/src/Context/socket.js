import io from "socket.io-client";

const socket = io("http://localhost:3000/", {
  query: {
    token: JSON.parse(localStorage.getItem("token")),
  },
});

export default socket;
