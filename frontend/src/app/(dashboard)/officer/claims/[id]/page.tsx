"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, FileText, Activity, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

export default function OfficerClaimDetail() {
  const params = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<any>(null);
  const [approvedAmount, setApprovedAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await api.get(`/claims/${params.id}`);
        setClaim(res.data);
        setApprovedAmount(res.data.claim_amount);
      } catch (err) {
        console.error(err);
      }
    };
    if (params.id) fetchClaim();
  }, [params.id]);

  const handleAction = async (status: string) => {
    try {
      await api.put(`/claims/${claim.id}/status`, {
        status,
        approved_amount: status === "APPROVED" ? parseFloat(approvedAmount) : null,
        officer_remarks: remarks
      });
      router.push("/officer");
    } catch (err) {
      console.error(err);
    }
  };

  if (!claim) return <div className="text-slate-500 font-medium">Loading claim data...</div>;

  const isHighRisk = claim.fraud_risk_level === "HIGH";
  const isMediumRisk = claim.fraud_risk_level === "MEDIUM";

  return (
    <div className="space-y-6">
      
      {/* 1. Top Claim Summary Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-semibold text-slate-900">Claim {claim.claim_number || `#CLM-${claim.id}`}</h1>
            {claim.status === "FLAGGED" && <Badge className="bg-red-50 text-red-700 border-red-200">Flagged</Badge>}
            {claim.status === "APPROVED" && <Badge className="bg-green-50 text-green-700 border-green-200">Approved</Badge>}
            {claim.status === "SUBMITTED" && <Badge className="bg-amber-50 text-amber-700 border-amber-200">Pending Review</Badge>}
          </div>
          <p className="text-sm text-slate-500 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Submitted on {new Date(claim.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-slate-500 mb-0.5">Policyholder</p>
            <p className="font-medium text-slate-900">Patient ID: PT-{claim.patient_id}</p>
          </div>
          <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
          <div>
            <p className="text-slate-500 mb-0.5">Hospital</p>
            <p className="font-medium text-slate-900">Facility ID: HOSP-{claim.hospital_id}</p>
          </div>
          <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
          <div>
            <p className="text-slate-500 mb-0.5">Requested Amount</p>
            <p className="font-semibold text-lg text-slate-900">${claim.claim_amount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Main Claim Details (Left - 2 Columns wide) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <Tabs defaultValue="details" className="w-full">
              <div className="bg-slate-50 border-b border-slate-200 px-2 pt-2">
                <TabsList className="bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="details" 
                    className="data-[state=active]:bg-white data-[state=active]:border-b-0 data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border border-transparent data-[state=active]:border-slate-200 px-6 py-2.5 font-medium"
                  >
                    Claim Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents" 
                    className="data-[state=active]:bg-white data-[state=active]:border-b-0 data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border border-transparent data-[state=active]:border-slate-200 px-6 py-2.5 font-medium"
                  >
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="audit" 
                    className="data-[state=active]:bg-white data-[state=active]:border-b-0 data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border border-transparent data-[state=active]:border-slate-200 px-6 py-2.5 font-medium"
                  >
                    Audit Trail
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="details" className="p-6 m-0 bg-white">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Diagnosis</p>
                    <p className="font-medium text-slate-900">{claim.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Treatment Type</p>
                    <p className="font-medium text-slate-900">{claim.treatment_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Date of Service</p>
                    <p className="font-medium text-slate-900">{new Date(claim.treatment_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Associated Policy</p>
                    <p className="font-medium text-blue-600 cursor-pointer hover:underline">POL-{claim.policy_id}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="p-6 m-0 bg-white min-h-[250px]">
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                  <FileText className="w-10 h-10 text-slate-300" />
                  <p>No external documents attached to this claim.</p>
                </div>
              </TabsContent>

              <TabsContent value="audit" className="p-6 m-0 bg-white">
                <div className="relative border-l border-slate-200 ml-3 space-y-6">
                  <div className="relative pl-6">
                    <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-200 border-2 border-white"></span>
                    <p className="text-sm font-medium text-slate-900">Claim Submitted</p>
                    <p className="text-xs text-slate-500">{new Date(claim.created_at).toLocaleString()}</p>
                  </div>
                  <div className="relative pl-6">
                    <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></span>
                    <p className="text-sm font-medium text-slate-900">Fraud Validation Engine</p>
                    <p className="text-xs text-slate-500">Automated check completed. Score: {claim.fraud_score}/100.</p>
                  </div>
                  <div className="relative pl-6 opacity-50">
                    <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-200 border-2 border-white"></span>
                    <p className="text-sm font-medium text-slate-900">Officer Decision Pending</p>
                    <p className="text-xs text-slate-500">Awaiting your action</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* 3. Right Fraud Risk & Decision Panel */}
        <div className="space-y-6">
          <Card className={`border rounded-xl shadow-sm overflow-hidden ${isHighRisk ? 'border-red-200' : isMediumRisk ? 'border-amber-200' : 'border-green-200'}`}>
            <div className={`p-4 border-b ${isHighRisk ? 'bg-red-50 border-red-100' : isMediumRisk ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
              <h3 className="font-semibold text-slate-900 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Risk Assessment
              </h3>
            </div>
            <CardContent className="p-5 bg-white space-y-6">
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Fraud Score</p>
                  <div className="flex items-baseline space-x-1">
                    <span className={`text-4xl font-bold ${isHighRisk ? 'text-red-600' : isMediumRisk ? 'text-amber-600' : 'text-green-600'}`}>
                      {claim.fraud_score}
                    </span>
                    <span className="text-slate-400 font-medium">/ 100</span>
                  </div>
                </div>
                <Badge className={
                  isHighRisk ? 'bg-red-100 text-red-700 hover:bg-red-100 border-transparent shadow-none' : 
                  isMediumRisk ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent shadow-none' : 
                  'bg-green-100 text-green-700 hover:bg-green-100 border-transparent shadow-none'
                }>
                  {claim.fraud_risk_level} RISK
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full ${isHighRisk ? 'bg-red-500' : isMediumRisk ? 'bg-amber-500' : 'bg-green-500'}`} 
                  style={{ width: `${claim.fraud_score}%` }}
                ></div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Triggered Rules</p>
                <div className="bg-slate-50 border border-slate-100 rounded-md p-3 text-sm">
                  {claim.fraud_flags && claim.fraud_flags.length > 0 ? (
                    <ul className="space-y-2 text-slate-700">
                      {claim.fraud_flags.map((flag: any) => (
                        <li key={flag.id} className="flex items-start">
                          <ShieldAlert className="w-4 h-4 text-amber-500 mr-2 mt-0.5 shrink-0" />
                          <span>{flag.description}</span>
                        </li>
                      ))}
                      {claim.ml_prediction !== "LEGITIMATE" && (
                        <li className="flex items-start">
                          <ShieldAlert className="w-4 h-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                          <span>Algorithm Prediction: {claim.ml_prediction}</span>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div className="flex items-center text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      <span>No critical anomalies detected.</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 rounded-xl shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-white">
              <h3 className="font-semibold text-slate-900">Officer Decision</h3>
            </div>
            <CardContent className="p-5 space-y-4 bg-slate-50/50">
              <div className="space-y-1.5">
                <Label className="text-slate-700">Approved Amount ($)</Label>
                <Input 
                  type="number" 
                  className="bg-white"
                  value={approvedAmount} 
                  onChange={(e) => setApprovedAmount(e.target.value)} 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700">Remarks (Visible to Hospital)</Label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter justification..." 
                  value={remarks} 
                  onChange={(e) => setRemarks(e.target.value)} 
                />
              </div>
              
              <div className="pt-2 space-y-3">
                <Button 
                  onClick={() => handleAction("APPROVED")} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  Approve Claim
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleAction("REJECTED")} 
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white"
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleAction("DOCUMENT_REQUIRED")} 
                    variant="outline"
                    className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                  >
                    Request Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
