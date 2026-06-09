"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LogOut, Home, FileText, Activity, Users, Settings, Search, Bell, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("cached_user");
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        localStorage.setItem("cached_user", JSON.stringify(res.data));
        fetchNotifications();
      } catch {
        localStorage.removeItem("cached_user");
        router.push("/login");
      }
    };
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchUser();
  }, [router]);

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cached_user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex h-screen bg-slate-50/50 overflow-hidden relative animate-pulse">
        {/* Sidebar Skeleton */}
        <aside className="w-[260px] border-r border-slate-200/50 flex flex-col shrink-0 bg-white">
          <div className="h-16 flex items-center px-6 border-b border-slate-200/50">
            <div className="w-6 h-6 bg-slate-200 rounded-lg mr-2" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>
          <div className="flex-1 py-6 px-4 space-y-6">
            <div className="space-y-2">
              <div className="h-3 w-12 bg-slate-100 rounded px-2" />
              <div className="h-10 w-full bg-slate-200 rounded-xl" />
              <div className="h-10 w-full bg-slate-100 rounded-xl" />
              <div className="h-10 w-full bg-slate-100 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-12 bg-slate-100 rounded px-2" />
              <div className="h-10 w-full bg-slate-100 rounded-xl" />
              <div className="h-10 w-full bg-slate-100 rounded-xl" />
            </div>
          </div>
          <div className="p-4 border-t border-slate-200/50 space-y-3">
            <div className="flex items-center space-x-3 p-2">
              <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-10 w-full bg-slate-100 rounded-xl" />
          </div>
        </aside>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-slate-200/50 flex items-center justify-between px-8 bg-white">
            <div className="h-10 w-80 bg-slate-100 rounded-xl" />
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="h-6 w-px bg-slate-200" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
          </header>
          <div className="flex-1 p-6 md:p-8 space-y-8">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-slate-200 rounded-lg" />
              <div className="h-4 w-72 bg-slate-100 rounded" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="h-24 bg-white border border-slate-200/50 rounded-xl" />
              <div className="h-24 bg-white border border-slate-200/50 rounded-xl" />
              <div className="h-24 bg-white border border-slate-200/50 rounded-xl" />
              <div className="h-24 bg-white border border-slate-200/50 rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  let links: { name: string; href: string; icon: any }[] = [];
  
  if (user.role === "ADMIN") {
    links = [
      { name: "Dashboard", href: "/admin", icon: <Home className="w-[18px] h-[18px] mr-3" /> },
      { name: "Users", href: "/admin/users", icon: <Users className="w-[18px] h-[18px] mr-3" /> },
    ];
  } else if (user.role === "CLAIM_OFFICER") {
    links = [
      { name: "Dashboard", href: "/officer", icon: <Home className="w-[18px] h-[18px] mr-3" /> },
      { name: "Pending Claims", href: "/officer/claims", icon: <Activity className="w-[18px] h-[18px] mr-3" /> },
      { name: "Audit Trail", href: "/officer/audit", icon: <FileText className="w-[18px] h-[18px] mr-3" /> },
    ];
  } else if (user.role === "HOSPITAL") {
    links = [
      { name: "Dashboard", href: "/hospital", icon: <Home className="w-[18px] h-[18px] mr-3" /> },
      { name: "Submit Claim", href: "/hospital/submit-claim", icon: <Activity className="w-[18px] h-[18px] mr-3" /> },
      { name: "My Claims", href: "/hospital/claims", icon: <FileText className="w-[18px] h-[18px] mr-3" /> },
    ];
  } else if (user.role === "PATIENT") {
    links = [
      { name: "Dashboard", href: "/patient", icon: <Home className="w-[18px] h-[18px] mr-3" /> },
      { name: "My Claims", href: "/patient/claims", icon: <FileText className="w-[18px] h-[18px] mr-3" /> },
    ];
  }

  // Common links for everyone
  const commonLinks = [
    { name: "Notifications", href: "/notifications", icon: <Bell className="w-[18px] h-[18px] mr-3" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="w-[18px] h-[18px] mr-3" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent pointer-events-none" />

      {/* Sidebar (260px) */}
      <aside className="w-[260px] glass border-r border-slate-200/50 flex flex-col shrink-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-200/50">
          <ShieldCheck className="w-6 h-6 text-blue-600 mr-2 drop-shadow-sm" />
          <span className="font-bold text-slate-900 tracking-tight text-lg">SmartHealth</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6">
          <div className="px-4">
            <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
            <nav className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href}>
                    <button
                      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative group overflow-hidden ${
                        isActive 
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50/30 text-blue-700 shadow-sm border border-blue-100/50" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                      )}
                      <span className={`mr-3 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-600' : 'group-hover:text-blue-500'}`}>
                        {link.icon}
                      </span>
                      {link.name}
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="px-4">
            <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System</p>
            <nav className="space-y-1">
              {commonLinks.map((link) => (
                 <Link key={link.name} href={link.href}>
                 <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all duration-300 hover:translate-x-1 group">
                   <span className="mr-3 group-hover:text-blue-500 transition-colors">
                     {link.icon}
                   </span>
                   {link.name}
                 </button>
               </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200/50 bg-slate-50/30">
          <div className="flex items-center space-x-3 mb-4 p-2 rounded-xl hover:bg-white/50 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0 shadow-sm">
              {user.full_name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-slate-900 truncate">{user.full_name}</div>
              <div className="text-xs text-slate-500 truncate">{user.email}</div>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-center text-slate-600 bg-white/50 backdrop-blur-sm border-slate-200/80 hover:bg-white hover:shadow-sm transition-all rounded-xl" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2 text-slate-400" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        {/* Top Header */}
        <header className="h-16 glass border-b border-slate-200/50 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center flex-1">
            {/* Minimal Search Bar */}
            <div className="relative w-full max-w-md hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                type="text" 
                placeholder="Search claims, policies, or users..." 
                className="pl-9 h-10 bg-slate-100/50 border-transparent rounded-xl focus-visible:border-blue-500/30 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Mark all as read</button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">No notifications yet.</div>
                    ) : (
                      notifications.map((notif: any) => (
                        <div key={notif.id} className={`p-3 border-b border-slate-50 text-sm ${notif.is_read ? 'bg-white text-slate-600' : 'bg-blue-50/30 text-slate-900 font-medium'}`}>
                          <p>{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{new Date(notif.created_at).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="h-6 w-px bg-slate-200/80"></div>
            <Badge variant="outline" className="bg-white text-blue-700 border-blue-200/50 shadow-sm font-semibold rounded-full px-3 py-1">
              {user.role.replace('_', ' ')}
            </Badge>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
