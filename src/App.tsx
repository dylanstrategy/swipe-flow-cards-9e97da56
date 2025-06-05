
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ResidentProvider } from "@/contexts/ResidentContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Discovery from "./pages/Discovery";
import Matches from "./pages/Matches";
import MoveIn from "./pages/MoveIn";
import Maintenance from "./pages/Maintenance";
import Operator from "./pages/Operator";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SuperAdmin from "./pages/SuperAdmin";
import UnknownRole from "./pages/UnknownRole";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ResidentProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unknown-role" element={<UnknownRole />} />
              
              {/* Protected routes */}
              <Route path="/super-admin" element={
                <ProtectedRoute requiredRole="super_admin">
                  <SuperAdmin />
                </ProtectedRoute>
              } />
              
              {/* Main app routes - these need authentication but allow role switching */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/discovery" element={
                <ProtectedRoute>
                  <Discovery />
                </ProtectedRoute>
              } />
              <Route path="/matches" element={
                <ProtectedRoute>
                  <Matches />
                </ProtectedRoute>
              } />
              <Route path="/movein" element={
                <ProtectedRoute>
                  <MoveIn />
                </ProtectedRoute>
              } />
              <Route path="/movein/:homeId" element={
                <ProtectedRoute>
                  <MoveIn />
                </ProtectedRoute>
              } />
              <Route path="/maintenance" element={
                <ProtectedRoute>
                  <Maintenance />
                </ProtectedRoute>
              } />
              <Route path="/operator" element={
                <ProtectedRoute>
                  <Operator />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ResidentProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
