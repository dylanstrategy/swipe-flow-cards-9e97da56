
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ResidentProvider } from "@/contexts/ResidentContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LiveResidentProvider } from "@/contexts/LiveResidentContext";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import Index from "./pages/Index";
import Resident from "./pages/Resident";
import Discovery from "./pages/Discovery";
import Matches from "./pages/Matches";
import MoveIn from "./pages/MoveIn";
import Maintenance from "./pages/Maintenance";
import Operator from "./pages/Operator";
import NotFound from "./pages/NotFound";
import SuperAdmin from "./pages/SuperAdmin";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleRoleRedirect = async (user: User) => {
    const email = user.email;
    
    // Check for super admin email first
    if (email === 'info@applaudliving.com') {
      navigate('/super-admin');
      return;
    }

    // Fetch role from database
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userProfile?.role) {
        switch (userProfile.role) {
          case 'super_admin':
            navigate('/super-admin');
            break;
          case 'senior_operator':
          case 'operator':
          case 'leasing':
            navigate('/operator');
            break;
          case 'maintenance':
          case 'vendor':
            navigate('/maintenance');
            break;
          case 'resident':
          case 'former_resident':
            navigate('/resident');
            break;
          case 'prospect':
          default:
            navigate('/');
            break;
        }
      } else {
        // Fallback to user metadata role if no database role
        const metadataRole = user.user_metadata?.role;
        if (metadataRole) {
          switch (metadataRole) {
            case 'super_admin':
              navigate('/super-admin');
              break;
            case 'senior_operator':
            case 'operator':
              navigate('/operator');
              break;
            case 'maintenance':
              navigate('/maintenance');
              break;
            case 'resident':
              navigate('/resident');
              break;
            default:
              navigate('/');
          }
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      navigate('/');
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setUser(data.session.user);
        handleRoleRedirect(data.session.user);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (event === 'SIGNED_IN' && currentUser) {
        // Small delay to allow database triggers to complete
        setTimeout(() => {
          handleRoleRedirect(currentUser);
        }, 500);
      } else if (event === 'SIGNED_OUT') {
        navigate('/register');
      }
      
      setIsLoading(false);
    });

    return () => listener?.subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={user ? <Index /> : <Navigate to="/register" replace />} />
      <Route path="/resident" element={user ? <Resident /> : <Navigate to="/register" replace />} />
      <Route path="/discovery" element={user ? <Discovery /> : <Navigate to="/register" replace />} />
      <Route path="/matches" element={user ? <Matches /> : <Navigate to="/register" replace />} />
      <Route path="/movein" element={user ? <MoveIn /> : <Navigate to="/register" replace />} />
      <Route path="/movein/:homeId" element={user ? <MoveIn /> : <Navigate to="/register" replace />} />
      <Route path="/maintenance" element={user ? <Maintenance /> : <Navigate to="/register" replace />} />
      <Route path="/operator" element={user ? <Operator /> : <Navigate to="/register" replace />} />
      <Route path="/super-admin" element={user ? <SuperAdmin /> : <Navigate to="/register" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <ResidentProvider>
              <LiveResidentProvider>
                <AuthenticatedApp />
              </LiveResidentProvider>
            </ResidentProvider>
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
