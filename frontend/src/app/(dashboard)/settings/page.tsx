"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Lock, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get("/auth/me").then(res => setUser(res.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md bg-blue-50 text-blue-700">
            <User className="w-4 h-4 mr-3" />
            Profile Details
          </button>
          <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50">
            <Lock className="w-4 h-4 mr-3" />
            Security & Password
          </button>
          <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50">
            <Bell className="w-4 h-4 mr-3" />
            Notification Preferences
          </button>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2">
          {!user ? (
            <div className="p-8 text-center text-slate-500">Loading user profile...</div>
          ) : (
            <Card className="border border-slate-200 shadow-sm rounded-xl">
              <div className="p-4 border-b border-slate-100 bg-white">
                <h3 className="font-semibold text-slate-900">Profile Information</h3>
              </div>
              <CardContent className="p-6 space-y-6 bg-white">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue={user.full_name} className="max-w-md" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} className="max-w-md" disabled />
                    <p className="text-xs text-slate-500">Email address cannot be changed directly. Contact support.</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Assigned Role</Label>
                    <Input id="role" defaultValue={user.role} className="max-w-md" disabled />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
