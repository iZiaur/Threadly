import Navbar from './Components/Navbar/Navbar';
import FlashMessage from './Components/FlashMessage/FlashMessage';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Shop from "./Pages/Shop"
import ShopCategory from "./Pages/ShopCategory"
import Product from "./Pages/Product"
import LoginSignUp from './Pages/LoginSignUp';
import Cart from "./Pages/Cart"
import Footer from './Components/Footer/Footer';
import men_banner from "./Components/Assets/banner_mens.png"
import women_banner from './Components/Assets/banner_women.png'
import kids_banner from "./Components/Assets/banner_kids.png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Search from './Pages/Search';

function App() {
  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('auth-token');
      const loginTime = localStorage.getItem('login-time');
      if (token && loginTime) {
        const now = new Date().getTime();
        // 5 minutes = 300000 ms
        if (now - parseInt(loginTime) > 300000) {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('login-time');
          toast.error('Session expired. Please log in again.');
          setTimeout(() => {
            window.location.replace('/login');
          }, 2000);
        }
      } else if (token && !loginTime) {
        localStorage.setItem('login-time', new Date().getTime().toString());
      }
    };
    checkSession();
    const interval = setInterval(checkSession, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return <div>
    
    <BrowserRouter>
<<<<<<< HEAD
    <ToastContainer />
=======
    <FlashMessage />
>>>>>>> ebdaa90 (fixed route)
    <Navbar/>
    <Routes>
      <Route path="/" element={<Shop/>}></Route>
      <Route path="/mens" element={<ShopCategory banner={men_banner}category="men"/>}></Route>
      <Route path="/womens" element={<ShopCategory banner={women_banner} category="women"/>}></Route>
      <Route path="/kids" element={<ShopCategory banner={kids_banner} category="kid"/>}></Route>
<<<<<<< HEAD
      <Route path="/search" element={<Search/>}></Route>
      <Route path="/product" element={<Product/>}>
      <Route path=":productId" element={<Product/>}></Route>
      </Route>
=======
      <Route path="/product" element={<Product/>}></Route>
      <Route path="/product/:productId" element={<Product/>}></Route>
>>>>>>> ebdaa90 (fixed route)
      <Route path="/cart" element={<  Cart/>}></Route>
      <Route path="/login" element={<LoginSignUp/>}></Route>
    </Routes>
    <Footer/>
    </BrowserRouter>
  </div>
}

export default App;
