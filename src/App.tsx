
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Discovery from "./pages/Discovery";
import Matches from "./pages/Matches";
import MoveIn from "./pages/MoveIn";
import Maintenance from "./pages/Maintenance";
import Operator from "./pages/Operator";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SuperAdmin from "./pages/SuperAdmin";
import OwnerLogin from "./pages/OwnerLogin";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, userProfile } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, userProfile, loading } = useAuth();
  
  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Route based on user role
  const getDefaultRoute = () => {
    if (!userProfile) return '/login';
    
    switch (userProfile.role) {
      case 'super_admin':
        return '/super-admin';
      case 'senior_operator':
      case 'operator':
        return '/operator';
      case 'maintenance':
        return '/maintenance';
      case 'leasing':
        return '/operator';
      case 'resident':
        return '/';
      case 'prospect':
        return '/discovery';
      default:
        return '/';
    }
  };

  return (
    <Routes>
      <Route path="/login" element={
        user && userProfile ? <Navigate to={getDefaultRoute()} replace /> : <Login />
      } />
      <Route path="/" element={
        <ProtectedRoute>
          {userProfile?.role === 'resident' ? <Index /> : <Navigate to={getDefaultRoute()} replace />}
        </ProtectedRoute>
      } />
      <Route path="/discovery" element={
        <ProtectedRoute>
          {['prospect', 'super_admin'].includes(userProfile?.role || '') ? <Discovery /> : <Navigate to={getDefaultRoute()} replace />}
        </ProtectedRoute>
      } />
      <Route path="/matches" element={
        <ProtectedRoute>
          {['prospect', 'super_admin'].includes(userProfile?.role || '') ? <Matches /> : <Navigate to={getDefaultRoute()} replace />}
        </ProtectedRoute>
      } />
      <Route path="/movein" element={
        <ProtectedRoute>
          {['resident', 'super_admin'].includes(userProfile?.role || '') ? <MoveIn /> : <Navigate to={getDefaultRoute()} replace />}
        </ProtectedRoute>
      } />
      <Route path="/movein/:homeId" element={
        <ProtectedRoute>
          {['resident', 'super_admin'].includes(userProfile?.role || '') ? <MoveIn /> : <Navigate to={getDefaultRoute()} replace />}
        </ProtectedRoute>
      } />
      <Route path="/maintenance" element={
        <ProtectedRoute>
          {['maintenance', 'super_admin'].includes(userProfile?.role || '') ? <Maintenance /> : <Navigate to={getDefaultRoute()} replace />}
        </ProtectedRoute>
      } />
      <Route path="/operator" element={
        <ProtectedRoute>
          {['senior_operator', 'operator', 'leasing', 'super_admin'].includes(userProfile?.role || '') ? <Operator /> : <Navigate to={getDefaultRoute()} replace />}
        </ProtectedRoute>
      } />
      <Route path="/super-admin" element={
        <ProtectedRoute>
          {userProfile?.role === 'super_admin' ? <SuperAdmin /> : <Navigate to={getDefaultRoute()} replace />}
        </ProtectedRoute>
      } />
      <Route path="/owner-login" element={<OwnerLogin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
