import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { History } from "./pages/History";
import { TransactionProvider } from "./context/TransactionContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { PrivateRoute } from "./components/PrivateRoute";
import JournalPage from "./pages/JournalPage";
import BlobCursor from "./components/BlobCursor";
import { Chatbot } from "./components/Chatbot";
import { JournalProvider } from "./context/JournalContext";

function App() {
  function DashboardLayout() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;

    return (
      <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
        <BlobCursor />
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
          <Chatbot />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <TransactionProvider>
          <ThemeProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Dashboard Routes */}
              <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/history" element={<History />} />
                <Route path="/journal" element={<JournalPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ThemeProvider>
        </TransactionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;