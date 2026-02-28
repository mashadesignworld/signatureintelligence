"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSignatures, filterSignatures } from "@/lib/features/signatureSlice";
import { Search, Users, RefreshCcw, MapPin, Fingerprint, FileDown, Trash2 } from "lucide-react";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getLiveSignatures, deleteSignature } from "@/app/actions"; // Make sure this file exists!

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { filteredItems, totalCount } = useAppSelector((state) => state.signatures);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Fetch live data from MySQL via Prisma on component mount
  useEffect(() => {
    handleSync();
  }, [dispatch]);

  // 2. The function that actually talks to the database
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const liveData = await getLiveSignatures();
      dispatch(setSignatures(liveData));
    } catch (error) {
      console.error("Database sync failed:", error);
      alert("Failed to connect to the live database. Check your IP whitelist in cPanel.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const result = await deleteSignature(id);
      if (result.success) {
        handleSync(); // Refresh data after deletion
      }
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Free Kenya Signature Registry", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 40,
      head: [['Name', 'ID Number', 'Mobile', 'County', 'Constituency', 'Ward']],
      body: filteredItems.map(item => [
        item.name, 
        item.idnumber, 
        item.mobile, 
        item.county, 
        item.constituency, 
        item.ward
      ]),
      headStyles: { fillColor: [45, 106, 79] },
    });

    doc.save("FreeKenya_Registry_Report.pdf");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-green to-brand-red rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white p-2 rounded-full shadow-xl">
              <Image src="/logo.png" alt="Free Kenya Logo" width={80} height={80} className="rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-serif font-bold text-brand-black tracking-tight">
              Signature <span className="text-brand-red italic underline decoration-brand-green/30 underline-offset-8">Intelligence</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.5em] font-black text-brand-green mt-2 opacity-70">
              People Power • Higher Power
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-white/80 backdrop-blur-md border border-white shadow-sm px-8 py-4 rounded-[2rem] flex items-center gap-4">
             <div className="bg-brand-green/10 p-2.5 rounded-full text-brand-green">
                <Users size={20} />
             </div>
             <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total Registry</p>
                <p className="text-2xl font-serif font-black text-brand-black">{totalCount}</p>
             </div>
          </div>
        </div>
      </header>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text"
            placeholder="Search by ID, Name, County or Constituency..."
            onChange={(e) => dispatch(filterSignatures(e.target.value))}
            className="w-full bg-white border-0 shadow-lg shadow-gray-200/50 py-5 pl-14 pr-6 rounded-3xl outline-none focus:ring-2 focus:ring-brand-green/20 transition-all text-gray-700"
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={exportToPDF}
            className="bg-white border border-gray-100 text-brand-black hover:bg-gray-50 px-6 py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-gray-200/50 cursor-pointer"
          >
            <FileDown size={18} className="text-brand-red" />
            Export PDF
          </button>

          <button 
            onClick={handleSync} // This button now actually works!
            className="bg-brand-green hover:bg-brand-black text-white px-8 py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all duration-500 shadow-xl shadow-brand-green/20 group cursor-pointer"
            disabled={isSyncing}
          >
            <RefreshCcw size={18} className={`${isSyncing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-700`} />
            {isSyncing ? 'Syncing...' : 'Sync Live DB'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="group relative bg-white border border-gray-100 p-8 rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
            
            <div className="mb-6 flex justify-between items-start">
                <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black text-brand-green bg-brand-green/5 px-3 py-1 rounded-lg uppercase tracking-widest border border-brand-green/10">
                        {item.county}
                    </span>
                    <span className="text-[9px] font-black text-brand-red bg-brand-red/5 px-3 py-1 rounded-lg uppercase tracking-widest border border-brand-red/10">
                        {item.constituency}
                    </span>
                </div>
                {/* Delete Button */}
                <button 
                    onClick={() => handleDelete(item.id, item.name)}
                    className="text-gray-200 hover:text-brand-red transition-colors duration-300"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-brand-black mb-1 leading-tight group-hover:text-brand-green transition-colors">{item.name}</h3>
              <div className="flex items-center gap-1.5">
                <Fingerprint size={12} className="text-brand-red opacity-50" />
                <p className="text-brand-red text-xs font-bold tracking-widest uppercase">ID: {item.idnumber}</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-gray-50 bg-gray-50/30 -mx-8 px-8 pb-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-brand-green opacity-40" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ward</span>
                    </div>
                    <span className="text-sm font-semibold text-brand-black">{item.ward}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-5">Mobile</span>
                    <span className="text-sm font-semibold text-brand-black">{item.mobile}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}