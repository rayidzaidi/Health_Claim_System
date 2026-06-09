"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "System Update",
      message: "The fraud detection model has been updated to v1.2.",
      time: "2 hours ago",
      type: "info",
      read: false
    },
    {
      id: 2,
      title: "New Claim Flagged",
      message: "Claim CLM-402 requires manual review due to high risk score.",
      time: "5 hours ago",
      type: "alert",
      read: false
    },
    {
      id: 3,
      title: "Weekly Report Ready",
      message: "Your weekly claims processing report is ready to download.",
      time: "1 day ago",
      type: "success",
      read: true
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Notifications</h1>
        <p className="text-slate-500 mt-1">Stay updated on system alerts and claim status changes.</p>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="divide-y divide-slate-100">
          {notifications.map((n) => (
            <div key={n.id} className={`p-5 flex items-start space-x-4 transition-colors ${n.read ? 'bg-white' : 'bg-blue-50/30'}`}>
              <div className={`p-2 rounded-full mt-1 shrink-0 ${
                n.type === 'alert' ? 'bg-red-100 text-red-600' : 
                n.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {n.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : 
                 n.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
                 <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-semibold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{n.time}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{n.message}</p>
              </div>
              {!n.read && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
