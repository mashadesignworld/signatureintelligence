import { auth } from "@/prisma/auth";
import { getSignatureAnalytics } from "@/lib/analytics";
import DashboardHero from "@/components/DashboardHero";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const analyticsData = await getSignatureAnalytics();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10">
        <div className="px-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Signature Intelligence</h1>
          <p className="text-slate-500">Real-time oversight of the FreeKenya Movement signatures.</p>
        </div>

        {/* The World-Class UI Component */}
        <DashboardHero data={analyticsData} />
      </div>
    </main>
  );
}