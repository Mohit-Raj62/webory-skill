"use client";

import { TrendingUp } from "lucide-react";

export function RewardsHistory({ history }: { history: any[] }) {
  if (history.length === 0) return null;

  return (
    <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                 <TrendingUp size={24} /> 
            </div>
            <div>
                <h2 className="text-2xl font-bold">Points & Rewards History</h2>
                <p className="text-sm text-gray-400">Track your earnings and redeemed items.</p>
            </div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-sm font-bold text-gray-400 uppercase">
                            <th className="p-4 px-6 min-w-[200px]">Item</th>
                            <th className="p-4 px-6">Points Spent</th>
                            <th className="p-4 px-6">Date</th>
                            <th className="p-4 px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((historyItem: any, i) => (
                            <tr key={historyItem._id || i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 px-6 font-medium text-white">{historyItem.item}</td>
                                <td className="p-4 px-6 text-yellow-400 font-bold">-{historyItem.pointsSpent} pts</td>
                                <td className="p-4 px-6 text-gray-400">{new Date(historyItem.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 px-6">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                                        historyItem.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        historyItem.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                        historyItem.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        'bg-green-500/10 text-green-500 border-green-500/20'
                                    }`}>
                                        {historyItem.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
