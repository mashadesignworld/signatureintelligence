import { prisma } from "@/lib/prisma";
import {  subDays, format } from "date-fns";

export async function getSignatureAnalytics() {
  // 1. Get Total Count
  const totalSignatures = await prisma.signature.count();

  // 2. Get Growth over the last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  const dailyGrowth = await prisma.signature.groupBy({
    by: ['createdAt'], // Assumes you have a createdAt field
    _count: { id: true },
    where: {
      createdAt: { gte: thirtyDaysAgo }
    },
    orderBy: { createdAt: 'asc' }
  });

  // 3. Get Regional Distribution (Top 5 Counties)
  const countyData = await prisma.signature.groupBy({
    by: ['county'],
    _count: { id: true },
    orderBy: {
      _count: { id: 'desc' }
    },
    take: 5
  });

  // Format daily data for the chart
  const chartData = dailyGrowth.map(day => ({
  date: day.createdAt ? format(new Date(day.createdAt), "MMM dd") : "Unknown",
    "Signatures": day._count.id
  }));

  const formattedCountyData = countyData.map(c => ({
    name: c.county || "Unknown",
    value: c._count.id
  }));

  return {
    totalSignatures,
    chartData,
    formattedCountyData
  };
}