"use client";

import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[80vh] px-6 py-12">
      <div className="glass max-w-md w-full rounded-2xl p-8 text-center space-y-6 shadow-xl border border-white/40">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Something went wrong!
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred in the system. Our clinical audits and operations have been notified.
          </p>
          {error.message && (
            <div className="p-3 bg-red-50/50 rounded-lg text-left text-xs font-mono text-red-700 border border-red-100 max-h-24 overflow-y-auto mt-2">
              {error.message}
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className={cn(
              buttonVariants({ variant: "default" }),
              "btn-primary-gradient h-11 px-6 rounded-xl flex items-center gap-2 cursor-pointer text-white"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 h-11 px-6 rounded-xl flex items-center gap-2"
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
