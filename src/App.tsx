import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Article from './pages/Article';
import About from './pages/About';
import NotFound from './component/includes/not_found';
import DetectionPage from './pages/Detection';
import ProductLayanan from './pages/layanan/Product';
import ShowArticle from './pages/ShowArtikel';
import GriyaJamu from './pages/layanan/GriyaJamu';
import RawatJalan from './pages/layanan/RawatJalan';
import LaboratoriumKlinik from './pages/layanan/LaboratoriumKlinik';
import AkupunturAkupresure from './pages/layanan/AkupunturAkupresure';
import KonsultasiGizi from './pages/layanan/KonsultasiGizi';
import PenelitianJamu from './pages/layanan/PenelitianJamu';
import PengolahanTanaman from './pages/layanan/PengolahanTanaman';
import WisataEdukasi from './pages/layanan/WisataEdukasi';
import PelatihanWorkshop from './pages/layanan/PelatihanWorkshop';
import Dashboard from './pages/Dashboard';
import ManagemenUsers from './pages/Dashboard/users';
import LoginPage from './pages/Auth/login';
import RegisterPage from './pages/Auth/register';
import Profile from './pages/profile';
import DashboardProduct from './pages/Dashboard/product/productList';
import DashboardProductCategory from './pages/Dashboard/product/productCategory';
import ProtectedRoute from './services/Protected/ProtectedRoute';
import UnauthorizedPage from './services/Protected/Unauthorized';
import DasboardServiceCategoryPage from './pages/Dashboard/Layanan/Layanan-Category';
import DashboardServicePage from './pages/Dashboard/Layanan/LayananList';
import ProductDetail from './component/includes/product/Detail';


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path= "/" element={<Home />} />
        <Route path= "/login" element={<LoginPage />} />
        <Route path= "/register" element={<RegisterPage />} />
        <Route path="/artikel" element={<Article />} />
        <Route path="/tentang" element={<About />} />
        <Route path="/detection-ai" element={<DetectionPage />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/artikel/:slug" element={<ShowArticle />} />

        <Route path="/layanan/griya-jamu" element={<GriyaJamu />} />
        <Route path="/layanan/rawat-jalan" element={<RawatJalan />} />
        <Route path="/layanan/laboratorium-klinik" element={<LaboratoriumKlinik />} />
        <Route path="/layanan/akupuntur-akupresure" element={<AkupunturAkupresure />} />
        <Route path="/layanan/konsultasi-gizi" element={<KonsultasiGizi/>} />
        <Route path="/layanan/pengolahan-tanaman" element={<PengolahanTanaman />} />
        <Route path="/layanan/penelitian-jamu" element={<PenelitianJamu />} />
        <Route path="/layanan/wisata-edukasi" element={<WisataEdukasi />} />
        <Route path="/layanan/pelatihan-workshop" element={<PelatihanWorkshop />} />
        <Route path="/layanan/produk-layanan" element={<ProductLayanan />} />
        <Route path="/layanan/produk-layanan/:id" element={<ProductDetail />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/users" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ManagemenUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/products-list" 
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardProduct />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/product-category" 
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardProductCategory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/service-category" 
          element={
            <ProtectedRoute requiredRole="admin">
              <DasboardServiceCategoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/services" 
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardServicePage/>
            </ProtectedRoute>
          } 
        />

        {/* Unauthorized page (optional) */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />  
      </Routes>
    </Router>
  );
}
export default App;