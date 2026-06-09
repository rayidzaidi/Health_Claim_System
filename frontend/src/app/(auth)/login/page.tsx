"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.access_token);

      const userRes = await api.get("/auth/me");
      const role = userRes.data.role;

      if (role === "ADMIN") router.push("/admin");
      else if (role === "CLAIM_OFFICER") router.push("/officer");
      else if (role === "HOSPITAL") router.push("/hospital");
      else if (role === "PATIENT") router.push("/patient");
      else router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 bg-blue-600 text-white relative overflow-hidden">
        {/* Subtle geometric pattern / shapes to represent structure, not AI blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-700 rounded-full opacity-30"></div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <ShieldCheck className="w-10 h-10 text-blue-200" />
            <h1 className="text-3xl font-bold tracking-tight">SmartHealth Operations</h1>
          </div>
          <h2 className="text-4xl font-semibold leading-tight">
            Secure, automated claim validation and risk management.
          </h2>
          <p className="text-blue-100 text-lg">
            A minimal, clinical enterprise platform for policyholders, hospitals, and insurance officers.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-16 w-full lg:w-1/2">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
          <div className="mb-8 text-center">
            <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-4 lg:hidden" />
            <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-2">Sign in to continue managing claims</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@healthclaim.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium text-[15px]">
              Sign In
            </Button>

            <div className="mt-6 border-t pt-4">
              <p className="text-xs text-slate-500 text-center">
                Demo Accounts:<br />
                admin@... | officer@... | hospital@... | patient@... <br />
                Password: [Role]@123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
