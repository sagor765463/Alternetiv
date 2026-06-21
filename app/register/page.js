"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { useAuth } from "../../context/use-auth";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setIsAuth, setUser } = useAuth();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { auth, googleProvider } = await import("../../lib/firebase");
      const { signInWithPopup } = await import("firebase/auth");
      await signInWithPopup(auth, googleProvider);
      window.location.href = "/";
    } catch (err) {
      console.error("Google Login error:", err);
      const errorMessage = err.message.replace("Firebase: ", "").replace(/\(auth.*\)./, "");
      setError(errorMessage || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { auth } = await import("../../lib/firebase");
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }

      window.location.href = "/";
    } catch (err) {
      console.error("Signup error:", err);
      // Format firebase error message
      const errorMessage = err.message.replace("Firebase: ", "").replace(/\\(auth.*\\)./, "");
      setError(errorMessage || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-darker to-background font-outfit">
      <Navbar />

      <main className="relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-80px)] px-6 pt-32">
        <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 w-full max-w-sm rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl"
        >
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-black text-white">Create Account</h1>
              <p className="mt-2 text-sm text-gray-300">Join Finex Corp! today</p>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 transition focus:border-primary focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 transition focus:border-primary focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 transition focus:border-primary focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 transition focus:border-primary focus:bg-white/10 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center text-sm"><span className="bg-background px-2 text-gray-400">or</span></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              type="button"
              className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-accent transition">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
