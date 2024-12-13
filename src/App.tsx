import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './page/Home';
import HerbalDetectionPage from './page/detection';
import ProductPage from './page/product';
import StoresPage from './page/stores';
import LoginPage from './page/auth/login';
import ProdusenPage from './page/produsen';
import RegisterPage from './page/auth/register';
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Home/>} path='/'/>
          <Route element={<HerbalDetectionPage/>} path='/detection_tanaman'/>
          <Route element={<ProductPage/>} path='/product'/>
          <Route element={<StoresPage/>} path='/store'/>
          <Route element={<ProdusenPage/>} path='/produsen'/>
          <Route element={<LoginPage/>} path='/login'/>
          
          <Route element={<RegisterPage/>} path='/register'/>
          <SpeedInsights/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
