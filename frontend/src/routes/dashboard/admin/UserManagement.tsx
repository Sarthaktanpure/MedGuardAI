import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableSkeleton } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Form";
import { toast } from "../../../components/ui/Toast";
import { User, UserRole } from "../../../../shared/types";
import { ShieldCheck, UserX, UserCheck } from "lucide-react";

export default function UserManagement() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/v1/admin/users");
      if (!res.ok) throw new Error("Failed to load user registry");
      return res.json();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, role, isActive }: { id: string; role?: UserRole; isActive?: boolean }) => {
      const res = await fetch(`/api/v1/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, isActive }),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`User ${data.displayName} updated successfully.`, "Audit Completed");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Failed to update user profile.", "Update Failed");
    },
  });

  const handleRoleChange = (id: string, role: UserRole) => {
    updateUserMutation.mutate({ id, role });
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    updateUserMutation.mutate({ id, isActive: !currentActive });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">User Administration</h1>
        <p className="text-xs text-muted-foreground font-medium">
          Manage system access, edit operational roles, and disable compromised profiles.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Profile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Operational Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Access Controls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((usr) => (
                <TableRow key={usr._id}>
                  <TableCell className="font-semibold text-xs text-slate-200">
                    {usr.displayName}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{usr.email}</TableCell>
                  <TableCell>
                    <Select
                      value={usr.role}
                      onChange={(e) => handleRoleChange(usr._id, e.target.value as UserRole)}
                      className="h-8 py-0.5 px-2 text-xs w-36"
                      disabled={updateUserMutation.isPending && updateUserMutation.variables?.id === usr._id}
                    >
                      <option value="patient">Patient / Consumer</option>
                      <option value="pharmacist">Pharmacist</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="regulator">District Regulator</option>
                      <option value="admin">System Admin</option>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {usr.isActive ? (
                      <Badge variant="genuine" className="text-[9px]">ACTIVE</Badge>
                    ) : (
                      <Badge variant="fake" className="text-[9px]">SUSPENDED</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={usr.isActive ? "destructive" : "outline"}
                      className="text-[10px] h-7.5 px-2"
                      isLoading={updateUserMutation.isPending && updateUserMutation.variables?.id === usr._id && updateUserMutation.variables?.isActive !== undefined}
                      onClick={() => handleToggleActive(usr._id, usr.isActive)}
                    >
                      {usr.isActive ? (
                        <>
                          <UserX className="h-3 w-3 mr-1" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3 w-3 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
