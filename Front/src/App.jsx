import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Authenticated from "./Authenticated";
import Unauthenticated from "./Unauthenticated";
import { useAuth } from "./Context/AuthProvider";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="*"
          element={user ? <Authenticated /> : <Unauthenticated />}
        />
      </Routes>
    </>
  );
}

export default App;
