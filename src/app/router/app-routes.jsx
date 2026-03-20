import { Routes, Route,Outlet,Navigate } from "react-router-dom";
import {
  Home,
  Auth,
  Checkout,
  ProductDetails,
  SearchCat
} from "@/app/features";
import { useAuth } from "@/app/providers/auth";


function ProtectedRoute({ children, requiredRole }) {
  const { user, admin } = useAuth();

  if (!user) return <Navigate to="/auth" state={{mode : 'login'}} replace/>;

  if (requiredRole === 'admin' && !admin) {
    return <Navigate to="/" replace/>;
  }

  return children;
}


function ChildrenLayout() {
  return (<Outlet/>)
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/search" element={<SearchCat />} />
      <Route path="/virtualAdopt" element={<Home />} />
      <Route path="/successStories" element={<Home />} />

      {/* Admin Nested */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><ChildrenLayout /></ProtectedRoute>}>      
        <Route path="checkout" element={<Checkout />} />
      </Route>


      <Route path="/products/:id" element={<ProductDetails />} />
    </Routes>
  );
}
