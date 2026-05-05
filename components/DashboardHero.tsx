"use client";

import { Card, AreaChart, BarChart, Title, Text, Metric, Flex, BadgeDelta, Grid } from "@tremor/react";
import { UsersIcon, MapIcon, TrendingUpIcon } from "lucide-react";

// --- NEW TYPE DEFINITIONS ---
interface DailyGrowth {
  date: string;
  Signatures: number;
}

interface CountyData {
  name: string;
  value: number;
}

interface AnalyticsProps {
  data: {
    totalSignatures: number;
    chartData: DailyGrowth[]; // Replaced any[]
    formattedCountyData: CountyData[]; // Replaced any[]
  }
}

export default function DashboardHero({ data }: AnalyticsProps) {
  return (
    <div className="p-6 space-y-6">
      {/* 1. Top Row: KPI Cards */}
      <Grid numItemsSm={1} numItemsLg={3} className="gap-6">
        <Card decoration="top" decorationColor="emerald">
          <Flex justifyContent="start" className="space-x-4">
            <UsersIcon className="text-emerald-600 w-10 h-10" />
            <div>
              <Text>Total Signatures Collected</Text>
              <Metric>{data.totalSignatures.toLocaleString()}</Metric>
            </div>
          </Flex>
          <BadgeDelta deltaType="moderateIncrease" className="mt-4">12.5% vs last month</BadgeDelta>
        </Card>

        <Card decoration="top" decorationColor="blue">
          <Flex justifyContent="start" className="space-x-4">
            <MapIcon className="text-blue-600 w-10 h-10" />
            <div>
              <Text>Active Counties</Text>
              <Metric>{data.formattedCountyData.length}</Metric>
            </div>
          </Flex>
        </Card>

        <Card decoration="top" decorationColor="amber">
          <Flex justifyContent="start" className="space-x-4">
            <TrendingUpIcon className="text-amber-600 w-10 h-10" />
            <div>
              <Text>Daily Velocity</Text>
              <Metric>+420</Metric>
            </div>
          </Flex>
        </Card>
      </Grid>

      {/* 2. Middle Row: The Main Growth Chart */}
      <Card className="mt-6">
        <Title>Collection Momentum</Title>
        <Text>Daily signatures tracked over the last 30 days</Text>
        <AreaChart
          className="h-72 mt-4"
          data={data.chartData}
          index="date"
          categories={["Signatures"]}
          colors={["emerald"]}
          showAnimation={true}
          valueFormatter={(number: number) => Intl.NumberFormat("en").format(number)}
        />
      </Card>

      {/* 3. Bottom Row: Regional Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Title>Top Performing Counties</Title>
          <BarChart
            className="h-72 mt-4"
            data={data.formattedCountyData}
            index="name"
            categories={["value"]}
            colors={["blue"]}
            yAxisWidth={48}
          />
        </Card>
        
        <Card>
            <Title>Goal Tracking</Title>
            <Text className="mt-2">Progress toward 1M legal requirement</Text>
            <div className="mt-8 flex justify-center">
                {/* We can add a custom Progress Circle here later */}
                <div className="text-center">
                    <Metric className="text-emerald-600">{(data.totalSignatures / 1000000 * 100).toFixed(2)}%</Metric>
                    <Text>of National Goal Reached</Text>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
}