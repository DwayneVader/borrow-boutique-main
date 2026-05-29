import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Users, Ban, ShieldCheck } from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/_app/admin/users")({
  component: ManajemenUserPage,
});

function ManajemenUserPage() {
  const [users, setUsers] = React.useState([
    { id: "USR-01", name: "Reynaldi Gles", email: "reynaldi@example.com", role: "super_admin", status: "Active" },
    { id: "USR-02", name: "Siti Rahma", email: "siti@example.com", role: "user", status: "Active" },
    { id: "USR-03", name: "Akun Spammer", email: "spam@badactor.com", role: "user", status: "Banned" },
  ]);

  const toggleBan = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "Active" ? "Banned" : "Active";
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <div className="p-1 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Manajemen User</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola hak akses role pengguna dan blokir akun yang melanggar aturan.</p>
      </div>

      <div className="glass rounded-3xl p-6 shadow-soft overflow-hidden">
        <div className="flex items-center gap-2 border-b pb-3 mb-4">
          <Users className="h-5 w-5 text-purple-600" />
          <h2 className="font-serif text-lg font-semibold">Daftar Pengguna Sistem</h2>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs text-foreground uppercase bg-muted/50 rounded-xl">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${u.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ● {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== "super_admin" && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className={u.status === "Active" ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"}
                        onClick={() => toggleBan(u.id)}
                      >
                        {u.status === "Active" ? <Ban className="h-3.5 w-3.5 mr-1" /> : <ShieldCheck className="h-3.5 w-3.5 mr-1" />}
                        {u.status === "Active" ? "Ban" : "Unban"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}