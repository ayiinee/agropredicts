import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Fields from "./pages/Fields";
import FieldDetail from "./pages/FieldDetail";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import Groups from "./pages/Groups";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import PestDetection from "./pages/PestDetection";
import FarmerProducts from "./pages/FarmerProducts";
import GroupManagement from "./pages/GroupManagement";
import CooperativeAnalytics from "./pages/CooperativeAnalytics";
import Treatment from "./pages/Treatment";
import TreatmentDetail from "./pages/TreatmentDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fields"
              element={
                <ProtectedRoute>
                  <Fields />
                </ProtectedRoute>
              }
            />
            <Route
              path="/field/:fieldId"
              element={
                <ProtectedRoute>
                  <FieldDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer-products"
              element={
                <ProtectedRoute>
                  <FarmerProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group"
              element={
                <ProtectedRoute>
                  <GroupManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <CooperativeAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pest-detection"
              element={
                <ProtectedRoute>
                  <PestDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/treatment"
              element={
                <ProtectedRoute>
                  <Treatment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/treatment/:id"
              element={
                <ProtectedRoute>
                  <TreatmentDetail />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
