import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./lib/auth";
import SiteHeader from "./components/SiteHeader";
import LandingPage from "./pages/LandingPage";
import VendorsPage from "./pages/VendorsPage";
import VendorDetailPage from "./pages/VendorDetailPage";
import BookPage from "./pages/BookPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import VendorDashboard from "./pages/VendorDashboard";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/vendors/:id" element={<VendorDetailPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;
  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <footer className="border-t border-brand-line bg-white">
            <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-brand-gray flex flex-wrap justify-between gap-3">
              <p>© {new Date().getFullYear()} Wedyora</p>
              <p>Customer marketplace · Vendor hub · Real-time assignments</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
