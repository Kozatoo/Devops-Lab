import { Route, Routes } from "react-router-dom";

const Authenticated = () => {
  return (
    <Routes>
      <Route path="*" element={<h1>hiiiiiiii</h1>} />
    </Routes>
  );
};
export default Authenticated;
