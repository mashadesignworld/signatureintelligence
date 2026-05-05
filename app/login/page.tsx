"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Fingerprint, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid administrative credentials.");
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center px-6">
      {/* Visual Identity consistent with Dashboard */}
      <div className="mb-12 text-center">
        <div className="relative inline-block group mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-green to-brand-red rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-white p-3 rounded-full shadow-xl">
            <Image src="/logo.png" alt="Free Kenya Logo" width={60} height={60} className="rounded-full" />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-brand-black tracking-tight">
          Signature <span className="text-brand-red italic underline decoration-brand-green/30 underline-offset-8">Intelligence</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-green mt-4 opacity-70">
          Admin Portal Access
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-gray-100 p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-2 mb-2 block">
                Administrative Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-gray-50 border-0 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-brand-green/20 transition-all text-gray-700 font-medium"
                placeholder="name@freekenya.co.ke"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-2 mb-2 block">
                Access Token / Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-gray-50 border-0 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-brand-green/20 transition-all text-gray-700 font-medium"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-brand-red/5 border border-brand-red/10 p-3 rounded-xl flex items-center gap-3">
               <ShieldCheck size={16} className="text-brand-red" />
               <p className="text-xs font-bold text-brand-red">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-green hover:bg-brand-black text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all duration-500 shadow-xl shadow-brand-green/20 group cursor-pointer disabled:opacity-50"
          >
            <Fingerprint size={20} className={`${isLoading ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
            {isLoading ? "Verifying..." : "Authorize Portal Access"}
          </button>
        </form>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-[9px] uppercase font-bold text-gray-400 tracking-[0.2em]">
          People Power • Higher Power • Secure Node
        </p>
      </footer>
    </div>
  );
}