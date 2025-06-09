import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const applyDark = () => {
      html.classList.add("dark");
      html.classList.remove("bg-white");
      html.classList.add("bg-gray-900");
    };

    const applyLight = () => {
      html.classList.remove("dark");
      html.classList.remove("bg-gray-900");
      html.classList.add("bg-white");
    };

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      applyDark();
      setIsDark(true);
    } else {
      applyLight();
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newDark = !isDark;

    if (newDark) {
      html.classList.add("dark");
      html.classList.remove("bg-white");
      html.classList.add("bg-gray-900");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      html.classList.remove("bg-gray-900");
      html.classList.add("bg-white");
      localStorage.setItem("theme", "light");
    }
    setIsDark(newDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 rounded transition-colors dark:bg-gray-800 text-black dark:text-white"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default DarkModeToggle;
