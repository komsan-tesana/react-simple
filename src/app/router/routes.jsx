import { Routes, Route } from "react-router-dom";
import {
  Home,
  Auth,
  Checkout,
  ProductDetails,
  AddProduct,
} from "../../features";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/add-products" element={<AddProduct />} />
    </Routes>
  );
}
