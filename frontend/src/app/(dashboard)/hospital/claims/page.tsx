"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HospitalClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get("/claims/");
        setClaims(res.data);
      } catch (err) {
        console.error("Failed to fetch claims", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My Submissions</h1>
          <p className="text-slate-500 mt-1">Track the status of your submitted claims.</p>
        </div>
        <Link href="/hospital/submit-claim">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Claim
          </Button>
        </Link>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-slate-900">All Claims</h3>
        </div>
        <div className="bg-white overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                <TableHead className="text-slate-500 font-medium h-11">Claim Ref</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Patient</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Amount</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Status</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Loading claims...</TableCell>
                </TableRow>
              ) : claims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">No claims submitted yet.</TableCell>
                </TableRow>
              ) : (
                claims.map((c) => (
                  <TableRow 
                    key={c.id} 
                    className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors h-14 cursor-pointer"
                    onClick={() => router.push(`/hospital/claims/${c.id}`)}
                  >
                    <TableCell className="font-medium text-slate-900">CLM-{c.id}</TableCell>
                    <TableCell className="text-slate-600">PT-{c.patient_id}</TableCell>
                    <TableCell className="font-medium">${c.claim_amount}</TableCell>
                    <TableCell>
                      {c.status === 'APPROVED' ? <Badge className="bg-green-50 text-green-700 border-green-200 shadow-none">Approved</Badge> :
                       c.status === 'FLAGGED' ? <Badge className="bg-red-50 text-red-700 border-red-200 shadow-none">Flagged</Badge> :
                       c.status === 'REJECTED' ? <Badge className="bg-slate-100 text-slate-700 border-slate-200 shadow-none">Rejected</Badge> :
                       c.status === 'DOCUMENT_REQUIRED' ? <Badge className="bg-amber-100 text-amber-700 border-amber-200 shadow-none">Action Required</Badge> :
                       <Badge className="bg-blue-50 text-blue-700 border-blue-200 shadow-none">Pending Review</Badge>}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{new Date(c.created_at).toLocaleDateString()}</TableCell>
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
