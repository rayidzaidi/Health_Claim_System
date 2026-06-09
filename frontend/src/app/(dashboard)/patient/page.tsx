"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PatientDashboard() {
  const [policies, setPolicies] = useState<any[]>([]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await api.get("/policies/");
        setPolicies(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPolicies();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patient Dashboard</h1>
        <p className="text-slate-500">View your active insurance policies and coverage.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {policies.map((policy) => (
          <Card key={policy.id} className="glass-card border-none overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="p-6 border-b border-slate-100/50 bg-white/40">
              <div className="flex justify-between items-center">
                <CardTitle className="text-blue-900 font-bold tracking-tight">Policy #{policy.policy_number}</CardTitle>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 shadow-sm">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5 bg-white/20 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1 tracking-wide uppercase">Remaining Limit</p>
                  <h3 className="text-3xl font-extrabold text-green-600 drop-shadow-sm">${policy.remaining_amount}</h3>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-100/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Total Coverage</span>
                  <span className="font-bold text-slate-900">${policy.coverage_amount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Valid Until</span>
                  <span className="font-semibold text-slate-900">{new Date(policy.end_date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100/50">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Covered Conditions</span>
                <p className="text-sm text-slate-800 bg-slate-50/50 p-3 rounded-xl border border-slate-100 leading-relaxed">{policy.covered_diseases}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {policies.length === 0 && (
          <div className="text-slate-500">No active policies found.</div>
        )}
      </div>
    </div>
  );
}
