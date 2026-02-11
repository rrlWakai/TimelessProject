import { Routes, Route, Navigate } from "react-router-dom";
import PublicHome from "./PublicHome";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminReservations from "./admin/pages/AdminReservations"; // ✅ add

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="reservations" element={<AdminReservations />} />{" "}
        {/* ✅ add */}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
