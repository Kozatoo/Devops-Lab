import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

const Unauthenticated = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Register />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};
export default Unauthenticated;
