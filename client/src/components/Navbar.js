import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Search, Bell, User, LogOut, Sun, Moon, Sparkles } from "lucide-react";
import LoginModal from "./LoginModal";

const CATEGORIES = [
  "All",
  "Technology",
  "Politics",
  "Business",
  "Science",
  "Health",
  "Sports",
  "Entertainment",
];

const Navbar = ({ setSearchQuery, activeCategory, setActiveCategory }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isDark, setIsDark] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  /* ---------------- Theme Init ---------------- */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
    } else {
      setIsDark(true);
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  };

  /* ---------------- Search ---------------- */
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmed = searchInput.trim();
    if (!trimmed) return;

    if (setSearchQuery) {
      setSearchQuery(trimmed);
      if (location.pathname !== "/") navigate("/");
    }
  };

  /* ---------------- Logout ---------------- */
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  /* ---------------- Category Style ---------------- */
  const getCategoryColorClass = (cat) => {
    if (activeCategory === cat || (cat === "All" && !activeCategory)) {
      return "bg-[var(--text)] text-[var(--bg)] font-bold shadow-md";
    }

    let hoverBorder = "hover:border-[var(--text-muted)]";

    switch (cat.toLowerCase()) {
      case "technology":
        hoverBorder = "hover:border-blue-500 hover:text-blue-500";
        break;
      case "politics":
        hoverBorder = "hover:border-red-500 hover:text-red-500";
        break;
      case "business":
        hoverBorder = "hover:border-yellow-500 hover:text-yellow-500";
        break;
      case "science":
        hoverBorder = "hover:border-green-500 hover:text-green-500";
        break;
      case "health":
        hoverBorder = "hover:border-orange-500 hover:text-orange-500";
        break;
      case "sports":
        hoverBorder = "hover:border-purple-500 hover:text-purple-500";
        break;
      case "entertainment":
        hoverBorder = "hover:border-amber-500 hover:text-amber-500";
        break;
      default:
        break;
    }

    return `bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] ${hoverBorder}`;
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "User";
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      <nav className="bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)] sticky top-0 z-40 transition-colors duration-300">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Top Row */}
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
              onClick={() => setActiveCategory?.("")}
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-[#ffb45a] text-black shadow-[0_0_15px_rgba(232,197,71,0.3)] group-hover:scale-105 transition-transform duration-300">
                <Sparkles size={22} className="absolute" />
              </div>

              <span className="font-playfair text-2xl lg:text-3xl font-black text-[var(--text)] hidden sm:block tracking-tight">
                NewsSphere
              </span>
            </Link>

            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-xl hidden md:block relative mx-4"
            >
              <input
                type="text"
                placeholder="Search articles, topics, or breaking news..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent2)] focus:border-transparent transition-all shadow-inner"
              />

              <Search
                className="absolute left-4 top-3 text-[var(--text-muted)]"
                size={20}
              />
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <>
                  {/* Notifications */}
                  <button className="relative p-2.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-[#ff5f5f] rounded-full border-2 border-[var(--bg)]"></span>
                  </button>

                  {/* User */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown((prev) => !prev)}
                      className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full border border-[var(--border)] hover:bg-[var(--surface)] transition-colors group ml-2"
                    >
                      <span className="text-sm font-medium text-[var(--text)] hidden sm:block">
                        {firstName}
                      </span>

                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent2)] to-[#c882ff] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                        {firstLetter}
                      </div>
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl py-2 z-50 animate-modal-scale origin-top-right">
                        <div className="px-4 py-3 border-b border-[var(--border)] mb-2">
                          <p className="text-sm font-bold text-[var(--text)] truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] font-mono truncate">
                            {user?.email}
                          </p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface2)] transition-colors"
                        >
                          <User size={16} className="text-[var(--accent2)]" />
                          Profile Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--red)] hover:bg-[var(--red)]/10 transition-colors text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-[var(--text)] text-[var(--bg)] font-bold px-6 py-2.5 rounded-full hover:bg-[var(--accent)] hover:shadow-[0_0_15px_rgba(232,197,71,0.3)] transition-all ml-2"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        {setActiveCategory && (
          <div className="border-t border-[var(--border)] bg-[var(--bg)]">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex overflow-x-auto hide-scrollbar py-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setActiveCategory(cat === "All" ? "" : cat)
                    }
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${getCategoryColorClass(
                      cat
                    )}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Navbar;