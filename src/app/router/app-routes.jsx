import { Routes, Route,Outlet,Navigate } from "react-router-dom";
import {
  Home,
  Auth,
  Checkout,
  ProductDetails,
  SearchCat,
  Dashboard,
  Adopt
} from "@/app/features";
import { useAuth } from "@/app/providers/auth";


function ProtectedRoute({ requiredRole }) {
  const { user, admin } = useAuth();

  if (!user) return <Navigate to="/auth" state={{mode : 'login'}} replace/>;

  if (requiredRole === 'admin' && !admin) {
    return <Navigate to="/" replace/>;
  }

  return <Outlet/>;
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
      <Route path="/virtualAdopt/:id" element={<Adopt />} />
      <Route path="/successStories" element={<Home />} />
      <Route path="checkout" element={<Checkout />} />
      {/* Admin Nested */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"/>}>         
        <Route path="dash-board" element={<Dashboard />} />
      </Route>


      <Route path="/products/:id" element={<ProductDetails />} />
    </Routes>
  );
}
