import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/sideBar";
import Messenger from "./pages/messenger";

const Authenticated = () => {
  return (
    <Routes>
      <Route path="*" element={<Messenger />} />
    </Routes>
  );
};
export default Authenticated;
