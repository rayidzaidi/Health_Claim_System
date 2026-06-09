"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PatientClaims() {
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get("/claims/");
        setClaims(res.data);
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
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Claims</h1>
        <p className="text-slate-500">Track the status of your submitted medical claims.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claim History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.claim_number || `CLM-${claim.id}`}</TableCell>
                  <TableCell>{new Date(claim.treatment_date).toLocaleDateString()}</TableCell>
                  <TableCell>{claim.diagnosis}</TableCell>
                  <TableCell>${claim.claim_amount}</TableCell>
                  <TableCell>{getStatusBadge(claim.status)}</TableCell>
                </TableRow>
              ))}
              {claims.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">No claims found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
