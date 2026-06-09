"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") return <Badge className="bg-slate-800 text-slate-100 hover:bg-slate-700">Admin</Badge>;
    if (role === "CLAIM_OFFICER") return <Badge className="bg-blue-100 text-blue-700 border-transparent hover:bg-blue-100 shadow-none">Officer</Badge>;
    if (role === "HOSPITAL") return <Badge className="bg-teal-100 text-teal-700 border-transparent hover:bg-teal-100 shadow-none">Hospital</Badge>;
    return <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-none">Patient</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">System Users</h1>
          <p className="text-slate-500 mt-1">Manage accounts and role permissions across the platform.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex items-center space-x-2">
          <Users className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-slate-900">User Directory</h3>
        </div>
        <div className="bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                <TableHead className="text-slate-500 font-medium h-11">Name</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Email</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Role</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Phone</TableHead>
                <TableHead className="text-slate-500 font-medium h-11">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Loading users...</TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors h-14">
                    <TableCell className="font-medium text-slate-900">{u.full_name}</TableCell>
                    <TableCell className="text-slate-600">{u.email}</TableCell>
                    <TableCell>{getRoleBadge(u.role)}</TableCell>
                    <TableCell className="text-slate-500">{u.phone || "N/A"}</TableCell>
                    <TableCell>
                      {u.is_active ? (
                         <span className="inline-flex items-center text-xs font-medium text-green-700">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                           Active
                         </span>
                      ) : (
                         <span className="inline-flex items-center text-xs font-medium text-slate-500">
                           <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                           Inactive
                         </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
