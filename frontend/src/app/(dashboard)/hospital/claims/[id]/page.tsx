"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Upload, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HospitalClaimDetail() {
  const params = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await api.get(`/claims/${params.id}`);
        setClaim(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (params.id) fetchClaim();
  }, [params.id]);

  const handleUpload = async () => {
    if (!file || !claim) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(`/claims/${claim.id}/documents`, formData);
      alert("Document uploaded successfully.");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleResubmit = async () => {
    try {
      await api.put(`/claims/${claim.id}/resubmit`);
      alert("Claim resubmitted successfully for review.");
      router.push("/hospital/claims");
    } catch (err) {
      console.error(err);
      alert("Failed to resubmit claim.");
    }
  };

  if (!claim) return <div className="text-slate-500 p-8 font-medium">Loading claim...</div>;

  const isDocumentRequired = claim.status === "DOCUMENT_REQUIRED";

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <Link href="/hospital/claims">
          <Button variant="outline" size="icon" className="h-9 w-9 bg-white rounded-full hover:bg-slate-50 text-slate-500">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Claim #{claim.claim_number || claim.id}</h1>
          <p className="text-slate-500 text-sm mt-1">Review your claim details and status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card border-none overflow-hidden">
            <div className="p-5 border-b border-slate-100/50 bg-white/40">
              <h3 className="font-semibold text-slate-900">Claim Information</h3>
            </div>
            <CardContent className="p-6 bg-white/20">
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Patient ID</p>
                  <p className="font-semibold text-slate-900">PT-{claim.patient_id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Policy ID</p>
                  <p className="font-semibold text-blue-600">POL-{claim.policy_id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Diagnosis</p>
                  <p className="font-medium text-slate-900">{claim.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Treatment Type</p>
                  <p className="font-medium text-slate-900">{claim.treatment_type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Requested Amount</p>
                  <p className="font-bold text-slate-900 text-lg">${claim.claim_amount}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Date of Service</p>
                  <p className="font-medium text-slate-900">{new Date(claim.treatment_date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none overflow-hidden">
            <div className="p-5 border-b border-slate-100/50 bg-white/40">
              <h3 className="font-semibold text-slate-900">Status & Actions</h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-sm text-slate-500 mb-2">Current Status</p>
                {claim.status === 'APPROVED' ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 shadow-sm">Approved</Badge> :
                 claim.status === 'FLAGGED' ? <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 py-1 shadow-sm">Flagged</Badge> :
                 claim.status === 'REJECTED' ? <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none px-3 py-1 shadow-sm">Rejected</Badge> :
                 claim.status === 'DOCUMENT_REQUIRED' ? <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1 shadow-sm">Action Required</Badge> :
                 <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 shadow-sm">Pending Review</Badge>}
              </div>

              {claim.officer_remarks && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Officer Remarks</p>
                  <p className="text-sm text-slate-800">{claim.officer_remarks}</p>
                </div>
              )}

              {isDocumentRequired && (
                <div className="space-y-4 pt-4 border-t border-slate-100/50">
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-amber-800">Additional Documents Required</h4>
                        <p className="text-xs text-amber-700 mt-1">Please review the officer remarks and upload the requested documents below.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <input 
                      type="file" 
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Button 
                      onClick={handleUpload} 
                      disabled={!file || uploading} 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      {uploading ? "Uploading..." : "Upload Document"}
                    </Button>
                  </div>

                  <Button 
                    onClick={handleResubmit} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    Resubmit Claim
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
