
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 text-lg">Initializing...</p>
      </div>
    </div>
  );
}

// App routes component that uses auth context - moved inside AuthProvider
function AppRoutes() {
  const { loading } = useAuth();

  // Show loading screen while auth is initializing
  if (loading) {
    return <LoadingScreen />;
  }

  return (
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
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ResidentProvider>
            <AppRoutes />
          </ResidentProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
