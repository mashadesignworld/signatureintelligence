"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid administrative credentials.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4">
      <div className="max-w-md w-full space-y-8 bg-[#161618] p-10 rounded-xl border border-white/10 shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">
            Signature Intelligence
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Admin Portal Access
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Email Address</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 bg-[#1c1c1f] border border-white/5 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="admin@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 bg-[#1c1c1f] border border-white/5 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors duration-200 uppercase tracking-widest text-sm"
          >
            Authorize Access
          </button>
        </form>
      </div>
    </div>
  );
}