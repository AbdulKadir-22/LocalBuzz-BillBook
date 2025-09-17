import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/registration";
import CartPage from "./pages/CartPage";
import AddProduct from "./pages/AddProduct";


const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/add-product" element={<AddProduct/>} />

    </Routes>
  );
};

export default AppRoutes;