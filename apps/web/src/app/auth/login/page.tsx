"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await login({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      setUser(result.data.user, result.data.accessToken);
      router.push("/account");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200"
          alt="Premium Kicks"
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="relative z-20 p-16 flex flex-col justify-between h-full">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">SNEAKROOM</h1>
            <p className="text-gray-400 mt-2">Premium kicks for the family.</p>
          </div>
          <div>
            <blockquote className="text-2xl font-light text-white italic">
              "It's not just a shoe, it's a lifestyle."
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-black mb-2 uppercase tracking-tight">Welcome Back</h2>
            <p className="text-gray-500">Sign in to access your orders and wishlist.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-4 rounded-r-xl text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all duration-300 shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500">
              New to SneakRoom?{" "}
              <Link href="/auth/register" className="font-black text-black hover:text-red-600 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
