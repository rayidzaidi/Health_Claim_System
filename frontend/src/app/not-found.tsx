"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[80vh] px-6 py-12">
      <div className="glass max-w-md w-full rounded-2xl p-8 text-center space-y-6 shadow-xl border border-white/40">
        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2 animate-bounce">
          <FileQuestion className="w-8 h-8 text-blue-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight text-gradient">
            404
          </h1>
          <h2 className="text-xl font-semibold text-slate-800">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 h-11 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "btn-primary-gradient h-11 px-6 rounded-xl flex items-center gap-2 text-white"
            )}
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
