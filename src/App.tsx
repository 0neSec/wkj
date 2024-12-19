import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./page/Home";
import HerbalDetectionPage from "./page/detection";
import ProductPage from "./page/product";
import StoresPage from "./page/stores";
import LoginPage from "./page/auth/login";
import ProdusenPage from "./page/produsen";
import RegisterPage from "./page/auth/register";
import Dashboard from "./page/dashboard";
import DashboardProductPage from "./page/dashboard/product";
import DashboardProductCategoryPage from "./page/dashboard/product/category";
import DashboardHerbalStorePage from "./page/dashboard/store";
import DashboardUserPage from "./page/dashboard/user";
import DashboardFooterContent1Page from "./page/dashboard/footer/alamat";
import DashboardFooterContent2Page from "./page/dashboard/footer/maps";
import DashboardFooterContent3Page from "./page/dashboard/footer/contact";
import DashboardJamuCenterPage from "./page/dashboard/central";
import DashboardProdusenPage from "./page/dashboard/produsen";
import ProductDetail from "./page/product/detail";
import ProtectedRoute from "./services/Protected/ProtectedRoute";
import DashboardHeroContentPage from "./page/dashboard/hero";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<HerbalDetectionPage />} path="/detection_tanaman" />
          <Route element={<ProductPage />} path="/product" />
          <Route element={<ProductDetail />} path="/product/:id" />
          <Route element={<StoresPage />} path="/central-jamu" />
          <Route element={<ProdusenPage />} path="/produsen" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
            path="/dashboard"
          />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardUserPage />
              </ProtectedRoute>
            }
            path="/dashboard/users"
          />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardJamuCenterPage />
              </ProtectedRoute>
            }
            path="/dashboard/center"
          />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardHeroContentPage />
              </ProtectedRoute>
            }
            path="/dashboard/banner"
          />
          {/* <Route element={<DashboardHerbalStorePage/>} path='/dashboard/store'/> */}
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardProductPage />
              </ProtectedRoute>
            }
            path="/dashboard/products"
          />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardProdusenPage />
              </ProtectedRoute>
            }
            path="/dashboard/produsen"
          />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardProductCategoryPage />
              </ProtectedRoute>
            }
            path="/dashboard/products/category"
          />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardFooterContent1Page />
              </ProtectedRoute>
            }
            path="/dashboard/footer/alamat"
          />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardFooterContent2Page />
              </ProtectedRoute>
            }
            path="/dashboard/footer/maps"
          />
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardFooterContent3Page />
              </ProtectedRoute>
            }
            path="/dashboard/footer/contact"
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
