import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import GeneratorPage from "./pages/GeneratorPage";
import DetailPage from "./pages/DetailPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page (Default) */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* Protected Main Workspace Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/detail" element={<DetailPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
