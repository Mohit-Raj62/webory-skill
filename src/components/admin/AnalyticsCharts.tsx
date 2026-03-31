"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Lazy load chart components
const Line = dynamic(() => import("react-chartjs-2").then(mod => mod.Line), { ssr: false });
const Bar = dynamic(() => import("react-chartjs-2").then(mod => mod.Bar), { ssr: false });
const Doughnut = dynamic(() => import("react-chartjs-2").then(mod => mod.Doughnut), { ssr: false });

export function AnalyticsCharts({ stats }: { stats: any }) {
  useEffect(() => {
    // Register ChartJS components on mount (client-side)
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Legend,
      ArcElement
    );
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#ccc" },
      },
      title: { display: false },
    },
    scales: {
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#ccc" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#ccc" },
      },
    },
  };

  const processChartData = (data: any[], type: 'count' | 'total') => {
      const labels = [];
      const values = [];
      const today = new Date();
      
      for(let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          labels.push(dateStr);
          
          const found = data?.find((item: any) => item._id === dateStr);
          values.push(found ? found[type] : 0);
      }
      return { labels, values };
  };

  const revenueChart = processChartData(stats?.charts?.revenueTrend || [], 'total');
  const userChart = processChartData(stats?.charts?.userGrowth || [], 'count');

  const revenueData = {
    labels: revenueChart.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: revenueChart.values,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const userGrowthData = {
    labels: userChart.labels,
    datasets: [
      {
        label: "New Users",
        data: userChart.values,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5">
        <h3 className="text-xl font-bold text-white mb-4">Revenue Trend (Last 7 Days)</h3>
        <Line options={chartOptions} data={revenueData} />
      </div>
      <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5">
        <h3 className="text-xl font-bold text-white mb-4">User Growth (Last 7 Days)</h3>
        <Bar options={chartOptions} data={userGrowthData} />
      </div>
      <div className="glass-card p-6 rounded-2xl lg:col-span-2 border border-white/5 bg-white/5">
        <h3 className="text-xl font-bold text-white mb-4">Revenue Distribution by Course</h3>
        <div className="h-64 flex justify-center">
             <Doughnut 
                data={{
                    labels: stats?.charts?.revenueDistribution?.map((d: any) => d._id) || [],
                    datasets: [{
                        data: stats?.charts?.revenueDistribution?.map((d: any) => d.total) || [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)',
                        ],
                        borderWidth: 0
                    }]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: { color: '#ccc' } } }
                }} 
            />
        </div>
      </div>
    </div>
  );
}
