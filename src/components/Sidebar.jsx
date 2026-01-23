import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Wallet, BarChart, History, BookOpen, Menu, X, LogOut, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import profilePic from "../assets/profile-pic.png";

export function Sidebar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Wallet, label: "Dashboard" },
    { path: "/analytics", icon: BarChart, label: "Analytics" },
    { path: "/history", icon: History, label: "History" },
    { path: "/journal", icon: BookOpen, label: "Journal" },
  ];

  if (!user) return null;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass-card rounded-lg text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 w-72 glass-sidebar z-40 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-8 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-heading">
            =2money
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`relative group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                  ? "bg-primary text-primary-foreground shadow-lg translate-x-1"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-primary-foreground" : ""}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <img src={profilePic} alt="Profile" className="h-10 w-10 rounded-full object-cover shadow-inner" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || "Priyanshu"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}