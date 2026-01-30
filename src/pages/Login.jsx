import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Default empty
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to log in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-2xl shadow-xl border border-border">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Welcome Back
            </h2>
            <p className="text-muted-foreground mt-2">Login to your dashboard</p>
          </div>

          {error && <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {loading ? "Logging In..." : "Log In"}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}