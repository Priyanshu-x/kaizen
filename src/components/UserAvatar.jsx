import React from "react";
import { useAuth } from "../context/AuthContext";

export function UserAvatar({ className = "h-10 w-10", textSize = "text-sm" }) {
    const { user } = useAuth();

    if (!user) return null;

    const name = user.name || user.displayName || "User";
    const initial = name.charAt(0).toUpperCase();

    // Generate consistent color based on name
    const colors = [
        "bg-red-500", "bg-orange-500", "bg-amber-500",
        "bg-green-500", "bg-emerald-500", "bg-teal-500",
        "bg-cyan-500", "bg-blue-500", "bg-indigo-500",
        "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
        "bg-pink-500", "bg-rose-500"
    ];

    const charCode = name.charCodeAt(0) || 0;
    const colorIndex = charCode % colors.length;
    const bgColor = colors[colorIndex];

    if (user.photoURL) {
        return (
            <img
                src={user.photoURL}
                alt={name}
                className={`${className} rounded-full object-cover shadow-inner border border-border`}
            />
        );
    }

    return (
        <div className={`${className} ${bgColor} rounded-full flex items-center justify-center text-white font-bold shadow-inner border border-white/10 ${textSize}`}>
            {initial}
        </div>
    );
}
