"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OfficerDashboard() {
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get("/claims/");
        // Sort pending and flagged claims to top
        const sorted = res.data.sort((a: any, b: any) => {
           if (a.status === "FLAGGED") return -1;
           if (a.status === "SUBMITTED" || a.status === "UNDER_REVIEW") return -1;
           return 1;
        });
        setClaims(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClaims();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'APPROVED': return <Badge className="bg-green-500">Approved</Badge>;
      case 'REJECTED': return <Badge variant="destructive">Rejected</Badge>;
      case 'FLAGGED': return <Badge className="bg-red-500">Flagged</Badge>;
      case 'SUBMITTED': return <Badge variant="secondary">New</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskBadge = (level: string) => {
    if (level === "HIGH") return <Badge variant="destructive">HIGH</Badge>;
    if (level === "MEDIUM") return <Badge className="bg-amber-500 hover:bg-amber-600">MEDIUM</Badge>;
    return <Badge className="bg-green-500 hover:bg-green-600">LOW</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Claim Review Queue</h1>
        <p className="text-slate-500">Review incoming claims and analyze fraud risk.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.claim_number || `CLM-${claim.id}`}</TableCell>
                  <TableCell>{new Date(claim.treatment_date).toLocaleDateString()}</TableCell>
                  <TableCell>${claim.claim_amount}</TableCell>
                  <TableCell>{getStatusBadge(claim.status)}</TableCell>
                  <TableCell>{getRiskBadge(claim.fraud_risk_level || "LOW")}</TableCell>
                  <TableCell>
                    <Link href={`/officer/claims/${claim.id}`}>
                      <Button variant="outline" size="sm">Review</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
