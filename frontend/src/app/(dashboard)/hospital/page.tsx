"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Activity, XCircle, CheckCircle2, FileText, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentClaims, setRecentClaims] = useState<any[]>([]);
  const [allClaims, setAllClaims] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/reports/dashboard-summary");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchClaims = async () => {
      try {
        const res = await api.get("/claims/");
        setAllClaims(res.data);
        setRecentClaims(res.data.slice(0, 5)); // Just show recent 5
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
    fetchClaims();
  }, []);

  if (!stats) return <div className="text-slate-500 font-medium">Loading system metrics...</div>;

  const statusData = [
    { name: "Approved", value: stats.approved_claims, color: "#22c55e" },
    { name: "Pending", value: stats.pending_claims, color: "#f59e0b" },
    { name: "Flagged", value: stats.flagged_claims, color: "#ef4444" },
    { name: "Rejected", value: stats.rejected_claims, color: "#64748b" },
  ].filter(d => d.value > 0);

  const highRisk = allClaims.filter(c => c.fraud_risk_level === 'HIGH').length;
  const mediumRisk = allClaims.filter(c => c.fraud_risk_level === 'MEDIUM').length;
  const lowRisk = allClaims.filter(c => c.fraud_risk_level === 'LOW').length;

  const riskData = [
    { name: "High", count: highRisk },
    { name: "Medium", count: mediumRisk },
    { name: "Low", count: lowRisk },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">System Overview</h1>
        <p className="text-slate-500 mt-1">High-level view of claim processing and fraud metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card className="glass-card border-none overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1 tracking-wide uppercase">Total Claims</p>
                <h3 className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">{stats.total_claims}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1 tracking-wide uppercase">Pending Review</p>
                <h3 className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">{stats.pending_claims || 0}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100/50 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1 tracking-wide uppercase">Flagged Claims</p>
                <h3 className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">{stats.flagged_claims}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-50 to-rose-50 border border-red-100/50 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1 tracking-wide uppercase">Approved Claims</p>
                <h3 className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">{stats.approved_claims}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100/50 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100/50">
              <p className="text-sm font-semibold text-green-600 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                Total Value: <span className="ml-1 tracking-tight">${stats.total_paid_amount.toLocaleString()}</span>
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Middle Section (Charts placeholder) */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm rounded-xl h-80 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Claims by Status</h3>
          </div>
          <div className="flex-1 p-4">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
            )}
          </div>
        </Card>
        <Card className="border-slate-200 shadow-sm rounded-xl h-80 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Fraud Risk Distribution</h3>
          </div>
          <div className="flex-1 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'High' ? '#ef4444' : entry.name === 'Medium' ? '#f59e0b' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Section: Recent Claims Table */}
      <Card className="glass-card border-none overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-100/50 bg-white/40 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Recent Claims Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b border-slate-200/50 hover:bg-transparent">
                <TableHead className="text-slate-500 font-semibold h-12 uppercase text-xs tracking-wider">Claim ID</TableHead>
                <TableHead className="text-slate-500 font-semibold h-12 uppercase text-xs tracking-wider">Hospital</TableHead>
                <TableHead className="text-slate-500 font-semibold h-12 uppercase text-xs tracking-wider">Amount</TableHead>
                <TableHead className="text-slate-500 font-semibold h-12 uppercase text-xs tracking-wider">Risk</TableHead>
                <TableHead className="text-slate-500 font-semibold h-12 uppercase text-xs tracking-wider">Status</TableHead>
                <TableHead className="text-slate-500 font-semibold h-12 uppercase text-xs tracking-wider">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white/20">
              {recentClaims.map((claim) => (
                <TableRow key={claim.id} className="table-row-hover border-b border-slate-100/50 h-16">
                  <TableCell className="font-semibold text-slate-900">{claim.claim_number || `CLM-${claim.id}`}</TableCell>
                  <TableCell className="text-slate-600 font-medium">HOSP-{claim.hospital_id}</TableCell>
                  <TableCell className="text-slate-900 font-bold">${claim.claim_amount}</TableCell>
                  <TableCell>
                    {claim.fraud_risk_level === 'HIGH' ? <Badge className="bg-red-50 text-red-700 border-red-200 shadow-none">High</Badge> :
                     claim.fraud_risk_level === 'MEDIUM' ? <Badge className="bg-amber-50 text-amber-700 border-amber-200 shadow-none">Medium</Badge> :
                     <Badge className="bg-green-50 text-green-700 border-green-200 shadow-none">Low</Badge>}
                  </TableCell>
                  <TableCell>
                    {claim.status === 'APPROVED' ? <Badge className="bg-green-50 text-green-700 border-green-200 shadow-none">Approved</Badge> :
                     claim.status === 'FLAGGED' ? <Badge className="bg-red-50 text-red-700 border-red-200 shadow-none">Flagged</Badge> :
                     <Badge className="bg-slate-100 text-slate-700 border-slate-200 shadow-none">{claim.status}</Badge>}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">{new Date(claim.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

    </div>
  );
}
