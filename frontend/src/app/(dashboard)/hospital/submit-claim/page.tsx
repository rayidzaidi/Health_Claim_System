"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUp, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";

export default function SubmitClaim() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patient_id: "1", 
    hospital_id: "1", 
    policy_id: "1",   
    diagnosis: "",
    treatment_type: "",
    claim_amount: "",
    treatment_date: new Date().toISOString().split('T')[0]
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Submit claim JSON
      const res = await api.post("/claims/", {
        ...formData,
        patient_id: parseInt(formData.patient_id),
        hospital_id: parseInt(formData.hospital_id),
        policy_id: parseInt(formData.policy_id),
        claim_amount: parseFloat(formData.claim_amount) || 0
      });
      
      const claimId = res.data.id;

      // 2. Upload documents if any
      if (files.length > 0) {
        for (const file of files) {
          const formPayload = new FormData();
          formPayload.append("file", file);
          await api.post(`/claims/${claimId}/documents`, formPayload, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
        }
      }

      router.push("/hospital");
    } catch (err) {
      console.error(err);
      alert("Error submitting claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Submit New Claim</h1>
        <p className="text-slate-500 mt-1">Enter medical and financial details to request reimbursement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Multi-section Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-slate-900 border-b pb-2">1. Policyholder Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policy_id" className="text-slate-700">Policy Number</Label>
                  <Input 
                    id="policy_id"
                    value={formData.policy_id} 
                    onChange={(e) => setFormData({...formData, policy_id: e.target.value})} 
                    required 
                    className="bg-white"
                  />
                  <p className="text-[11px] text-slate-400">Unique identifier for active policy</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient_id" className="text-slate-700">Patient ID</Label>
                  <Input 
                    id="patient_id"
                    value={formData.patient_id} 
                    onChange={(e) => setFormData({...formData, patient_id: e.target.value})} 
                    required 
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-slate-900 border-b pb-2">2. Treatment Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="treatment_type" className="text-slate-700">Treatment Type</Label>
                  <Input 
                    id="treatment_type"
                    placeholder="e.g. Inpatient Surgery" 
                    value={formData.treatment_type} 
                    onChange={(e) => setFormData({...formData, treatment_type: e.target.value})} 
                    required 
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment_date" className="text-slate-700">Treatment Date</Label>
                  <Input 
                    id="treatment_date"
                    type="date" 
                    value={formData.treatment_date} 
                    onChange={(e) => setFormData({...formData, treatment_date: e.target.value})} 
                    required 
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="diagnosis" className="text-slate-700">Diagnosis Code / Description</Label>
                  <Input 
                    id="diagnosis"
                    placeholder="e.g. Appendicitis (K35.80)" 
                    value={formData.diagnosis} 
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} 
                    required 
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-slate-900 border-b pb-2">3. Claim Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="claim_amount" className="text-slate-700">Claim Amount ($)</Label>
                  <Input 
                    id="claim_amount"
                    type="number" 
                    placeholder="0.00" 
                    value={formData.claim_amount} 
                    onChange={(e) => setFormData({...formData, claim_amount: e.target.value})} 
                    required 
                    className="bg-white text-lg font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bill_ref" className="text-slate-700">Bill Reference Number</Label>
                  <Input 
                    id="bill_ref"
                    placeholder="INV-2023-XYZ" 
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-slate-900 border-b pb-2">4. Document Upload</h2>
              <label htmlFor="file-upload" className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
                <FileUp className="w-8 h-8 text-blue-500 mb-3" />
                <p className="font-medium text-slate-700">Click to upload medical documents</p>
                <p className="text-xs mt-1">PDF, JPG, PNG up to 10MB each</p>
                <input 
                  id="file-upload" 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
              {files.length > 0 && (
                <div className="mt-2 text-sm text-slate-600 bg-white p-3 border border-slate-200 rounded-md">
                  <p className="font-semibold mb-1">Selected files:</p>
                  <ul className="list-disc pl-5">
                    {files.map((f, i) => <li key={i}>{f.name}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Section 5 */}
            <div className="pt-4 flex justify-end gap-4">
              <Button type="button" variant="outline" className="bg-white text-slate-700 hover:bg-slate-50 border-slate-200">
                Save Draft
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]" disabled={loading}>
                {loading ? "Submitting..." : "Submit Claim"}
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
              <div className="bg-slate-50 p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Live Validation Summary</h3>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  <div className="p-4 flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Policy Status</p>
                      <p className="text-xs text-slate-500 mt-0.5">Active (Valid until Dec 2026)</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-start space-x-3">
                    <Activity className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Coverage Remaining</p>
                      <p className="text-xs text-slate-500 mt-0.5">$350,000.00 available</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div className="w-full">
                      <p className="text-sm font-medium text-slate-900">Estimated Risk</p>
                      {parseFloat(formData.claim_amount) > 100000 ? (
                        <p className="text-xs text-red-500 mt-0.5 font-medium">High - Exceeds typical limits</p>
                      ) : (
                        <p className="text-xs text-amber-600 mt-0.5 font-medium">Medium Analysis</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-900 mb-2">
                    <span>Documents Uploaded</span>
                    <span>{files.length}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(files.length * 25, 100)}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
