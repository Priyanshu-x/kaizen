import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    console.log("ProtectedRoute - User:", user); // Debug log
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AuthProvider>
      <TransactionProvider>
        <ThemeProvider>
          <Router>
            <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <BlobCursor />
              <Navbar />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/login" element={<Login />} />
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
                  </Routes>
                </main>
              </div>
              <Chatbot />
            </div>
          </Router>
        </ThemeProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}

// Ensure useAuth is available
import { useAuth } from "./context/AuthContext";

export default App;