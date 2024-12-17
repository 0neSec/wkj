import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './page/Home';
import HerbalDetectionPage from './page/detection';
import ProductPage from './page/product';
import StoresPage from './page/stores';
import LoginPage from './page/auth/login';
import ProdusenPage from './page/produsen';
import RegisterPage from './page/auth/register';
import Dashboard from './page/dashboard';
import DashboardProductPage from './page/dashboard/product';
import DashboardProductCategoryPage from './page/dashboard/product/category';
import DashboardHerbalStorePage from './page/dashboard/store';
import DashboardUserPage from './page/dashboard/user';
import DashboardFooterContent1Page from './page/dashboard/footer/alamat';
import DashboardFooterContent2Page from './page/dashboard/footer/maps';
import DashboardFooterContent3Page from './page/dashboard/footer/contact';

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
          <Route element={<Dashboard/>} path='/dashboard'/>
          <Route element={<DashboardUserPage/>} path='/dashboard/users'/>
          <Route element={<DashboardHerbalStorePage/>} path='/dashboard/store'/>
          <Route element={<DashboardProductPage/>} path='/dashboard/products'/>
          <Route element={<DashboardProductCategoryPage/>} path='/dashboard/products/category'/>
          <Route element={<DashboardFooterContent1Page/>} path='/dashboard/footer/alamat'/>
          <Route element={<DashboardFooterContent2Page/>} path='/dashboard/footer/maps'/>
          <Route element={<DashboardFooterContent3Page/>} path='/dashboard/footer/contact'/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
