import "./assets/styles/global.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import AboutUs from "./pages/AboutUs";
import Account from "./pages/Account";
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import Product from "./pages/Product";
import Site404 from "./pages/404";

import Main from "./layouts/Main";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { HistoryProvider } from "./context/HistoryContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <HistoryProvider>
            <BrowserRouter>
            <Routes>
            <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:category" element={<Catalog />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/404" element={<Site404 />} />
            <Route path="*" element={<Site404 />} />
          </Route>
            </Routes>
          </BrowserRouter>
          </HistoryProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
