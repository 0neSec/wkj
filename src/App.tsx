import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Article from "./pages/Article";
import Tentang from "./pages/Tentang";
import NotFound from "./component/includes/not_found";
import DetectionPage from "./pages/Detection";
import ProductLayanan from "./pages/layanan/Product";
import ShowArticle from "./pages/ShowArtikel";
import GriyaJamu from "./pages/layanan/GriyaJamu";
import RawatJalan from "./pages/layanan/RawatJalan";
import LaboratoriumKlinik from "./pages/layanan/LaboratoriumKlinik";
import AkupunturAkupresure from "./pages/layanan/AkupunturAkupresure";
import KonsultasiGizi from "./pages/layanan/KonsultasiGizi";
import PenelitianJamu from "./pages/layanan/PenelitianJamu";
import PengolahanTanaman from "./pages/layanan/PengolahanTanaman";
import WisataEdukasi from "./pages/layanan/WisataEdukasi";
import PelatihanWorkshop from "./pages/layanan/PelatihanWorkshop";
import Dashboard from "./pages/Dashboard";
import ManagemenUsers from "./pages/Dashboard/users";
import LoginPage from "./pages/Auth/login";
import DashboardProduct from "./pages/Dashboard/product/productList";
import DashboardProductCategory from "./pages/Dashboard/product/productCategory";
import ProtectedRoute from "./services/Protected/ProtectedRoute";
import UnauthorizedPage from "./services/Protected/Unauthorized";
import DasboardServiceCategoryPage from "./pages/Dashboard/Layanan/Layanan-Category";
import DashboardServicePage from "./pages/Dashboard/Layanan/LayananList";
import ProductDetail from "./component/includes/product/Detail";
import DashboardProfile from "./pages/Dashboard/profile";
import DashboardTask from "./pages/Dashboard/profile/taskTentang";
import FunctionManagement from "./pages/Dashboard/profile/fungsiTentang";
import RegisterPage from "./pages/Auth/register";
import HistoryManagement from "./pages/Dashboard/profile/HistoryTentang";
import MisiManagement from "./pages/Dashboard/profile/MisiManagement";
import VisiManagement from "./pages/Dashboard/profile/VisiManagement";
import OrganizationStructureManagement from "./pages/Dashboard/profile/OrganisasiStruktur";
import DashboardServiceCategoryPage from "./pages/Dashboard/Layanan/Layanan-Category";
import NewsManagement from "./pages/Dashboard/News-Content";
import ArticleCategoryManagement from "./pages/Dashboard/Artikel/Category";
import ArticleManagement from "./pages/Dashboard/Artikel";
import Profile from "./pages/user/profile";

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/artikel" element={<Article />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/identifikasi-tanaman" element={<DetectionPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/artikel/:id" element={<ShowArticle />} />

        <Route path="/layanan/griya-jamu" element={<GriyaJamu />} />
        <Route path="/layanan/rawat-jalan" element={<RawatJalan />} />
        <Route
          path="/layanan/laboratorium-klinik"
          element={<LaboratoriumKlinik />}
        />
        <Route
          path="/layanan/akupuntur-akupresure"
          element={<AkupunturAkupresure />}
        />
        <Route path="/layanan/konsultasi-gizi" element={<KonsultasiGizi />} />
        <Route
          path="/layanan/pengolahan-tanaman"
          element={<PengolahanTanaman />}
        />
        <Route path="/layanan/penelitian-jamu" element={<PenelitianJamu />} />
        <Route path="/layanan/wisata-edukasi" element={<WisataEdukasi />} />
        <Route
          path="/layanan/pelatihan-workshop"
          element={<PelatihanWorkshop />}
        />
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
          path="/dashboard/berita"
          element={
            <ProtectedRoute requiredRole="admin">
              <NewsManagement />
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
          path="/dashboard/services"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardServicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/services-category"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardServiceCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content/tentang"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content/task"
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content/funtion"
          element={
            <ProtectedRoute requiredRole="admin">
              <FunctionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content/sejarah"
          element={
            <ProtectedRoute requiredRole="admin">
              <HistoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content/misi"
          element={
            <ProtectedRoute requiredRole="admin">
              <MisiManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content/visi"
          element={
            <ProtectedRoute requiredRole="admin">
              <VisiManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content/struktur"
          element={
            <ProtectedRoute requiredRole="admin">
              <OrganizationStructureManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/artikel"
          element={
            <ProtectedRoute requiredRole="admin">
              <ArticleManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/artikel-category"
          element={
            <ProtectedRoute requiredRole="admin">
              <ArticleCategoryManagement />
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
