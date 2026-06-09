"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, ShieldAlert } from "lucide-react";

export default function OfficerAuditTrail() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get("/claims/");
        setClaims(res.data);
      } catch (err) {
        console.error("Failed to fetch claims for audit", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Audit Trail</h1>
        <p className="text-slate-500 mt-1">Review historical actions, fraud analysis logs, and decisions.</p>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-slate-900">Global Claim Log</h3>
        </div>
        <div className="bg-white overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                <TableHead className="text-slate-500 font-medium h-11">Timestamp</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Event</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Claim Ref</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Risk Level</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Action Taken By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Loading audit logs...</TableCell>
                </TableRow>
              ) : (
                claims.map((c) => (
                  <TableRow key={c.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors h-14">
                    <TableCell className="text-slate-500 text-sm">{new Date(c.updated_at || c.created_at).toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-slate-900">
                      Status changed to {c.status}
                    </TableCell>
                    <TableCell className="text-blue-600 cursor-pointer hover:underline">CLM-{c.id}</TableCell>
                    <TableCell>
                      {c.fraud_risk_level === 'HIGH' ? <Badge className="bg-red-50 text-red-700 border-red-200 shadow-none">High</Badge> :
                       c.fraud_risk_level === 'MEDIUM' ? <Badge className="bg-amber-50 text-amber-700 border-amber-200 shadow-none">Medium</Badge> :
                       <Badge className="bg-green-50 text-green-700 border-green-200 shadow-none">Low</Badge>}
                    </TableCell>
                    <TableCell className="text-slate-600">System / Officer</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
