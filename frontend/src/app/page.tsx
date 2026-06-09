import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Activity, Database, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-slate-900 tracking-tight">SmartHealth</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/login">
            <Button variant="outline" className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100 mb-4">
          {/* <span className="w-2 h-2 rounded-full bg-blue-500"></span> */}
          {/* <span>System v1.0 Live</span> */}
        </div>

        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
          Smart Health Insurance <br /> Claim Processing
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Automated claim validation, risk scoring, and transparent claim tracking for healthcare insurance workflows.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 px-8">
              Login to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 h-12 px-8">
              View System Workflow
            </Button>
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white border-t border-slate-200 py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Automated Risk Scoring</h3>
            <p className="text-sm text-slate-500">Validation engine flags high-risk claims instantly using clinical and historical data patterns.</p>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
              <Database className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Structured Workflows</h3>
            <p className="text-sm text-slate-500">Role-based access ensuring hospitals, officers, and administrators have specific, secure views.</p>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Fast Approvals</h3>
            <p className="text-sm text-slate-500">Low-risk claims are processed quickly, reducing friction and wait times for policyholders.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>Minimal Clinical Enterprise Dashboard &copy; 2026. Secure Healthcare Platform.</p>
      </footer>
    </div>
  );
}
