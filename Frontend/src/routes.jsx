import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/registration";


const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />

    </Routes>
  );
};

export default AppRoutes;