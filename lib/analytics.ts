import { prisma }from "./prisma";

// Match these exactly to the types in your DashboardHero component
export interface AnalyticsResult {
  totalSignatures: number;
  chartData: { date: string; Signatures: number }[]; // Changed 'count' to 'Signatures'
  formattedCountyData: { name: string; value: number }[];
}

export async function getSignatureAnalytics(): Promise<AnalyticsResult> {
  // 1. Get the absolute total
  const totalSignatures = await prisma.signature.count();

  // 2. Fetch ALL groupings to prevent data loss
  const allCountyData = await prisma.signature.groupBy({
    by: ['county'],
    _count: { id: true },
    orderBy: {
      _count: { id: 'desc' }
    }
  });

  // 3. Slice Top 5 and calculate "Others"
  const topFiveRaw = allCountyData.slice(0, 5);
  const remainingData = allCountyData.slice(5);
  
  const otherCountiesSum = remainingData.reduce((acc, curr) => acc + curr._count.id, 0);

  // 4. Map the top 5 to the chart format
  const formattedCountyData = topFiveRaw.map(c => ({
    name: c.county || "Unknown",
    value: c._count.id
  }));

  if (otherCountiesSum > 0) {
    formattedCountyData.push({
      name: "Other Counties",
      value: otherCountiesSum
    });
  }

  // 5. Daily Growth Logic (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Note: We use a raw query or group by date only if your createdAt includes time
  const dailyCounts = await prisma.signature.groupBy({
    by: ['createdAt'],
    _count: { id: true },
    where: {
      createdAt: { gte: sevenDaysAgo }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

const chartData = dailyCounts.map(d => ({
  // The '!' tells TypeScript we know it's not null, 
  // or we can use a fallback check like this:
  date: d.createdAt 
    ? d.createdAt.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) 
    : 'N/A',
  Signatures: d._count.id
}));

  return {
    totalSignatures,
    chartData,
    formattedCountyData
  };
}