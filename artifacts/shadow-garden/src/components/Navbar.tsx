import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import logoPath from "@assets/7b7ac791-6c04-4e4f-9e07-44131e4310bb_1778662052573.png";
import { Menu, X, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/cards", label: "Cards" },
    { href: "/chat", label: "Chat" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/85 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-red-900/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <img src={logoPath} alt="Shadow Garden" className="h-10 w-auto object-contain cursor-pointer" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  location === link.href
                    ? "text-red-500 glow-text"
                    : "text-white/65 hover:text-red-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLocation("/profile")}
                  className="flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm text-white/75 hover:text-red-400 transition-colors"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                  <span>{user.display_name}</span>
                </button>
                <button onClick={handleLogout} className="p-2 text-white/40 hover:text-red-400 transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-4 py-2 text-sm text-white/70 hover:text-red-400 transition-colors font-medium">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="btn-primary px-5 py-2 text-sm rounded-full font-semibold text-white">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-white/75" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/[0.06] py-4 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-white/75 hover:text-red-400 transition-colors font-medium border-b border-white/[0.05]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <button onClick={() => { setLocation("/profile"); setMenuOpen(false); }} className="flex items-center gap-2 py-2 text-white/75">
                  <User size={16} /> {user.display_name}
                </button>
                <button onClick={handleLogout} className="py-2 text-red-400">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-2 text-center text-white/70 border border-white/10 rounded-xl">Login</button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <button className="w-full py-2 text-center btn-primary rounded-xl font-semibold text-white">Register</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
