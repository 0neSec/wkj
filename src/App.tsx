import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './page/Home';
import HerbalDetectionPage from './page/detection';
import ProductPage from './page/product';
import StoresPage from './page/stores';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Home/>} path='/'/>
          <Route element={<HerbalDetectionPage/>} path='/detection_tanaman'/>
          <Route element={<ProductPage/>} path='/product'/>
          <Route element={<StoresPage/>} path='/store'/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
