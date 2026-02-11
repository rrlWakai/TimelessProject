import { Routes, Route, Navigate } from "react-router-dom";
import PublicHome from "./PublicHome";

// admin pages (we'll create these next step)
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<PublicHome />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
