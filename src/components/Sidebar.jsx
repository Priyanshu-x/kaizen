import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, BarChart, History, BookOpen } from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Wallet, label: "Dashboard" },
    { path: "/analytics", icon: BarChart, label: "Analytics" },
    { path: "/history", icon: History, label: "History" },
    { path: "/journal", icon: BookOpen, label: "Journal" },
  ];

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden p-4 text-gray-600 dark:text-dark-text hover:text-primary dark:hover:text-dark-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 w-64 bg-white dark:bg-gray-800 shadow-lg dark:shadow-none p-4 transition duration-200 z-50 md:z-10`}>
        <div className="flex items-center space-x-2 mb-6">
          <Wallet className="h-8 w-8 text-primary dark:text-dark-primary" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Money Tracker</h2>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-2 p-2 text-gray-600 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md hover:text-primary dark:hover:text-dark-primary"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto text-sm text-gray-500 dark:text-gray-400">User Info</div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}