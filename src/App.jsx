import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { History } from "./pages/History";
import { TransactionProvider } from "./context/TransactionContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Login } from "./pages/Login";
import JournalPage from "./pages/JournalPage";
import BlobCursor from "./components/BlobCursor";
import { Chatbot } from "./components/Chatbot";
import { useAuth } from "./context/AuthContext";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const DashboardLayout = () => {
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
  };

  return (
    <AuthProvider>
      <TransactionProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Standalone Login Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Dashboard Routes */}
              <Route element={<DashboardLayout />}>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
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
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/journal"
                  element={
                    <ProtectedRoute>
                      <JournalPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;