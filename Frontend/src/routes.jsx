import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/registration";
import CartPage from "./pages/CartPage";
import AddProduct from "./pages/AddProduct";
import GenerateInvoice from "./pages/GenerateInvoice";
import History from "./pages/History";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/add-product" element={<AddProduct/>} />
      <Route path="/generate-invoice" element={<GenerateInvoice/>} />
      <Route path="/history" element={<History />} />

    </Routes>
  );
};

export default AppRoutes;