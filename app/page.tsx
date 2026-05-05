"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSignatures, filterSignatures } from "@/lib/features/signatureSlice";
import { 
  Search, Users, RefreshCcw, MapPin, 
  Fingerprint, FileDown, Trash2, LogOut, ShieldCheck 
} from "lucide-react";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getLiveSignatures, deleteSignature } from "@/app/actions";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { filteredItems, totalCount } = useAppSelector((state) => state.signatures);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = useCallback(async () => {
    if (status !== "authenticated") return;
    setIsSyncing(true);
    try {
      const liveData = await getLiveSignatures();
      dispatch(setSignatures(liveData));
    } catch (error) {
      console.error("Database sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") handleSync();
  }, [status, handleSync]);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Remove ${name} from registry?`)) {
      const result = await deleteSignature(id);
      if (result.success) handleSync();
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Free Kenya Signature Registry", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'ID Number', 'Mobile', 'County', 'Constituency', 'Ward']],
      body: filteredItems.map(item => [item.name, item.idnumber, item.mobile, item.county, item.constituency, item.ward]),
      headStyles: { fillColor: [15, 23, 42] },
    });
    doc.save("Registry_Report.pdf");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <RefreshCcw className="animate-spin text-slate-800 mb-4" size={32} />
        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Authenticating System...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-20">
      {/* Editorial Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={45} height={45} className="rounded-full shadow-md" />
            <div className="hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-1">Internal Portal</p>
              <p className="text-sm font-serif font-bold text-slate-900">FreeKenya Movement</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end border-r border-slate-200 pr-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Authorized Officer</p>
              <p className="text-xs font-bold text-slate-700">{session.user?.email}</p>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 bg-slate-900 hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-lg shadow-slate-200"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-16">
        {/* Editorial Header */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-emerald-600" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Verified Database</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 mb-4">
              Signature <span className="italic text-slate-400">Registry.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Managing digital civic participation for the <span className="text-slate-900 font-semibold">FreeKenya Movement</span> across all 47 counties.
            </p>
          </div>

          <div className="bg-white border border-slate-100 shadow-2xl shadow-slate-100 px-10 py-6 rounded-[2.5rem] flex items-center gap-6">
            <div className="bg-slate-50 p-4 rounded-3xl">
              <Users size={28} className="text-slate-900" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Signature Count</p>
              <p className="text-4xl font-serif font-black text-slate-900 leading-none">{totalCount.toLocaleString()}</p>
            </div>
          </div>
        </header>

        {/* High-End Action Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text"
              placeholder="Search registry by ID, Name, or Location..."
              onChange={(e) => dispatch(filterSignatures(e.target.value))}
              className="w-full bg-white border border-slate-100 shadow-xl shadow-slate-100/50 py-6 pl-16 pr-8 rounded-[2rem] outline-none focus:ring-4 focus:ring-slate-50 transition-all text-slate-700 font-medium"
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={exportToPDF}
              className="bg-white border border-slate-100 text-slate-900 hover:bg-slate-50 px-8 py-6 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-slate-100"
            >
              <FileDown size={18} className="text-slate-400" />
              Export
            </button>

            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-slate-900 hover:bg-black text-white px-10 py-6 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-all duration-500 shadow-xl shadow-slate-200 group disabled:opacity-70"
            >
              <RefreshCcw size={18} className={`${isSyncing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-700`} />
              {isSyncing ? 'Syncing...' : 'Refresh Live'}
            </button>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map((item) => (
            <div key={item.id} className="group bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:bg-slate-100"></div>
              
              <div className="relative z-10">
                <div className="mb-8 flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <span className="w-fit text-[9px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                      {item.county}
                    </span>
                    <span className="w-fit text-[9px] font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100">
                      {item.constituency}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mb-10">
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 group-hover:text-slate-600 transition-colors tracking-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Fingerprint size={14} className="text-slate-300" />
                    <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase">National ID: {item.idnumber}</p>
                  </div>
                </div>
                
                <div className="space-y-5 pt-8 border-t border-slate-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg"><MapPin size={14} className="text-slate-400" /></div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Ward Location</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.ward}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-12">Contact</span>
                    <span className="text-sm font-bold text-slate-800 underline decoration-slate-100 underline-offset-4">{item.mobile}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}