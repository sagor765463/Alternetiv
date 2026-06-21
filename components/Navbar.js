"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/use-auth";

const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Free Resources",
    href: "/resources",
  },
  {
   name: "Products",
    href: "/memhub",
  },
  {
     name: "Pricing",
    href: "/pricing",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const { isAuth, user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setMobileMenu(false);
  };

  return (
    <header className="fixed top-6 left-1/2 z-50 w-full -translate-x-1/2 px-4">
      <motion.nav
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          relative mx-auto max-w-5xl
          overflow-hidden rounded-[28px]
          border border-glass-border
          bg-glass-bg
          backdrop-blur-xl
        "
      >
        {/* Glass Layer */}
        <div
          className="
            pointer-events-none
            absolute inset-0
            bg-gradient-to-b
            from-white/[0.03]
            to-white/[0.01]
          "
        />

        {/* Navbar */}
        <div
          className="
            relative flex h-[76px]
            items-center justify-between
            px-5
          "
        >
          {/* Logo */}
          <Link
            href="/"
            className="relative z-20 flex items-center gap-3"
          >
            <div
              className="
                flex h-11 w-11 items-center
                justify-center rounded-full
                border border-glass-border
                bg-glass-bg
                backdrop-blur-xl
              "
            >
              <span className="text-lg font-black text-color-text-primary">
                ✦
              </span>
            </div>

            <h1
              className="
                text-[28px] font-black tracking-tight
                text-color-text-primary
              "
            >
              FINEX
              <span className="text-color-text-secondary">
                {" "}
                CORP!
              </span>
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-2 font-sans md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={false}
                  className="relative z-20"
                >
                  {active && (
                    <motion.div
                      layoutId="active-pill"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                      className="
                        pointer-events-none
                        absolute inset-0 rounded-full
                        border border-glass-border
                        bg-white/[0.06]
                        backdrop-blur-2xl
                      "
                    />
                  )}

                  <span
                    className={`
                      relative z-10 flex items-center
                      rounded-full px-7 py-3
                      text-[13px] tracking-[0.15em]
                      transition-all duration-300
                      ${
                        active
                          ? "text-color-text-primary"
                          : "text-color-text-secondary hover:text-color-text-primary"
                      }
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Auth Buttons */}
            {!isAuth ? (
              <Link
                href="/login"
                className="
                  hidden md:flex items-center
                  rounded-full
                  border border-glass-border
                  bg-glass-bg
                  px-6 py-3
                  text-sm font-medium text-color-text-primary
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:bg-white/[0.06]
                "
              >
                Login
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="
                      flex items-center gap-2
                      rounded-full
                      border border-glass-border
                      bg-glass-bg
                      px-6 py-3
                      text-sm font-medium text-color-text-primary
                      backdrop-blur-xl
                      transition-all duration-300
                      hover:bg-white/[0.06]
                    "
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-2
                    rounded-full
                    border border-rose-400/30
                    bg-rose-500/10
                    px-6 py-3
                    text-sm font-medium text-rose-300
                    backdrop-blur-xl
                    transition-all duration-300
                    hover:bg-rose-500/20
                  "
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="
                relative z-20
                flex h-11 w-11 items-center justify-center
                rounded-full
                border border-glass-border
                bg-glass-bg
                text-color-text-primary
                backdrop-blur-xl
                md:hidden
              "
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="
                relative z-20
                overflow-hidden
                border-t border-glass-border
                md:hidden
              "
            >
              <div className="flex flex-col gap-2 p-4 cur">
                {navItems.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenu(false)}
                      className={`
                        rounded-2xl border px-5 py-4
                        text-sm font-semibold tracking-[0.12em]
                        transition-all duration-300
                        ${
                          active
                            ? "border-glass-border bg-white/[0.06] text-color-text-primary"
                            : "border-transparent bg-transparent text-color-text-secondary hover:border-glass-border hover:bg-white/[0.03] hover:text-color-text-primary"
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Mobile Auth */}
                {!isAuth ? (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenu(false)}
                    className="
                      mt-2 rounded-2xl
                      border border-glass-border
                      bg-glass-bg
                      px-5 py-4
                      text-sm font-semibold
                      text-color-text-primary
                      backdrop-blur-sm
                      inline-block w-full text-center transition hover:bg-white/[0.06]
                    "
                  >
                    Login
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenu(false)}
                        className="
                          rounded-2xl
                          border border-glass-border
                          bg-glass-bg
                          px-5 py-4
                          text-sm font-semibold
                          text-color-text-primary
                          backdrop-blur-sm
                          inline-block w-full text-center transition hover:bg-white/[0.06]
                        "
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenu(false);
                      }}
                      className="
                        rounded-2xl
                        border border-rose-400/30
                        bg-rose-500/10
                        px-5 py-4
                        text-sm font-semibold
                        text-rose-300
                        backdrop-blur-sm
                        w-full transition hover:bg-rose-500/20
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}