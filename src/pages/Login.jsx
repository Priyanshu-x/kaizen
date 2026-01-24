import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "../components/Logo";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate a tiny delay for effect or real async if login was async
    setTimeout(() => {
      if (login(username, password)) {
        navigate(from, { replace: true });
      } else {
        setError("Invalid credentials.");
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-full overflow-hidden bg-black selection:bg-white/30 selection:text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black z-0"></div>

      {/* Abstract Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px] pointer-events-none opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px] pointer-events-none opacity-20 animate-pulse delay-1000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="glass-card flex flex-col items-center p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">

          {/* Logo Component - Monochrome */}
          <div className="mb-8 scale-150">
            <Logo className="h-10 w-10 text-white" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-heading text-white tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-zinc-400 text-sm">Sign in to manage your empire.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/10 rounded-xl text-gray-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/50 focus:border-white/50 transition-all hover:bg-zinc-900/80"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/10 rounded-xl text-gray-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/50 focus:border-white/50 transition-all hover:bg-zinc-900/80"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg shadow-lg shadow-white/10 hover:shadow-white/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer or extra link */}
          <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
            <p className="text-xs text-gray-600">
              Is the market volatile? <span className="text-gray-400 hover:text-primary cursor-pointer transition-colors">Stay calm and log it.</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}