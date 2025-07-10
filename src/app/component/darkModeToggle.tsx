"use client";

import { useTheme } from "../component/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`ps-2 transition duration-300 bg-transparent  ${
        theme === "dark"
          ? "text-white hover:text-white"
          : "text-gray-700 hover:text-gray-800"
      }`}
      // className="text-blue-600  dark:text-blue-400 hover:underline transition"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
