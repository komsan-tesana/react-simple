import "./App.css";
import {AppRoutes} from "./app/router";
import {AuthProvider,CartProvider} from "./app/providers";
import Navbar from "./shared/components/Navbar";

function App() {
  return (   
      <AuthProvider>
      <CartProvider>
        <div className="app">
          <Navbar />
          <AppRoutes/>
        </div>
      </CartProvider>
       </AuthProvider>
  );
}

export default App;
