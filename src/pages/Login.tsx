
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button onClick={handleGoogleLogin} className="btn btn-primary text-white bg-black px-4 py-2 rounded">
        Continue with Google
      </button>
    </div>
  );
};

export default Login;
