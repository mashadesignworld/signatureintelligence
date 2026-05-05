import { auth } from "@/prisma/auth";
import { getSignatureAnalytics } from "@/lib/analytics";
import DashboardHero from "@/components/DashboardHero";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
   ChevronLeft, 
  ShieldCheck, 
  Calendar 
} from "lucide-react";

export const dynamic = "force-dynamic"; // Ensures data is fresh on every visit

export default async function AnalyticsPage() {
  const session = await auth();

  // 1. Security Gate
  if (!session) {
    redirect("/login");
  }

  // 2. Data Fetching (Server-Side)
  const analyticsData = await getSignatureAnalytics();
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-20">
      {/* Editorial Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Logo" width={45} height={45} className="rounded-full shadow-md" />
              <div className="hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-1">Intelligence Module</p>
                <p className="text-sm font-serif font-bold text-slate-900">FreeKenya Movement</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-6 border-l border-slate-100 pl-8">
              <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors pb-1">
                Registry
              </Link>
              <Link href="/dashboard/analytics" className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1">
                Analytics
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex flex-col items-end border-r border-slate-200 pr-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">System Access</p>
              <p className="text-xs font-bold text-slate-700">{session.user?.email}</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-12">
        {/* Breadcrumbs & Utility Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Registry</span>
          </Link>

          <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Report Date: {currentDate}</span>
          </div>
        </div>

        {/* Analytical Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-emerald-600" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Growth Analysis</span>
          </div>
          <h1 className="text-5xl font-serif font-bold tracking-tight text-slate-900 mb-4">
            Data <span className="italic text-slate-400">Insights.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Visualizing mobilization trends and regional distribution to strategize the 
            <span className="text-slate-900 font-semibold"> FreeKenya Movement&apos;s </span> 
            national reach.
          </p>
        </header>

        {/* The Analytics Visualizations */}
        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
            <DashboardHero data={analyticsData} />
        </div>

        {/* Footer Insight */}
        <footer className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h4 className="text-lg font-serif font-bold">Strategic Summary</h4>
                <p className="text-slate-400 text-sm">Based on current momentum, the movement is scaling across {analyticsData.formattedCountyData.length} key regions.</p>
            </div>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Download Executive Brief
            </button>
        </footer>
      </main>
    </div>
  );
}