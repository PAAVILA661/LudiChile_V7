"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import withAdminAuth from "@/components/auth/withAdminAuth";
import type { AdminPageProps } from "@/types/admin";
import type { User } from "@/types/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Edit } from "lucide-react";
import { UserRole } from "@prisma/client"; // Importar UserRole

interface UserForAdminList
  extends Omit<User, "user_xp" | "progress" | "user_badges"> {
  // Podemos añadir más campos si los seleccionamos en la API
}

const AdminUsersPage: React.FC<AdminPageProps> = ({ user: adminUser }) => {
  const [users, setUsers] = useState<UserForAdminList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserForAdminList | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = useState<UserRole | string>("");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching users:", err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openEditModal = (user: UserForAdminList) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsModalOpen(true);
    setUpdateError(null);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as UserRole);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;

    setIsUpdatingRole(true);
    setUpdateError(null);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update role");
      }
      // Actualizar la lista de usuarios o el usuario específico en el estado
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id ? { ...u, role: data.role } : u,
        ),
      );
      setIsModalOpen(false);
    } catch (err: any) {
      setUpdateError(err.message);
      console.error("Error updating role:", err);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container">
        {/* ... (Header de la página y botón de volver) ... */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-pixel text-codedex-gold">
            User Management
          </h1>
          <Button
            variant="outline"
            className="border-codedex-teal text-codedex-teal hover:bg-codedex-teal/10"
            asChild
          >
            <Link href="/admin/dashboard">
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {isLoading && <p className="text-center text-lg">Loading users...</p>}
        {error && (
          <p className="text-center text-red-500 text-lg">Error: {error}</p>
        )}

        {!isLoading && !error && (
          <div className="bg-codedex-navy shadow-xl rounded-lg overflow-hidden">
            <table className="min-w-full">
              {/* ... (thead) ... */}
              <thead className="bg-codedex-darkNavy/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-pixel text-codedex-teal uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-codedex-gold/10">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-codedex-darkNavy/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${user.role === UserRole.ADMIN ? "bg-codedex-teal/20 text-codedex-teal" : "bg-gray-600/30 text-gray-400"}
                      `}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="link"
                        className="text-codedex-gold hover:text-codedex-gold/80 p-0 h-auto flex items-center"
                        onClick={() => openEditModal(user)}
                        disabled={adminUser?.id === user.id} // Deshabilitar edición para el propio admin actual
                      >
                        <Edit size={14} className="mr-1" /> Edit Role
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-codedex-navy border-codedex-gold/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-codedex-gold font-pixel">
                Edit Role for {selectedUser.email}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Select the new role for this user. Be careful when changing
                roles, especially for admin users.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-2">
              <label
                htmlFor="role-select"
                className="text-sm font-medium text-gray-300 block mb-1"
              >
                Role
              </label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger
                  id="role-select"
                  className="w-full bg-codedex-darkNavy border-gray-700 text-white"
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-codedex-navy border-codedex-gold/20 text-white">
                  {Object.values(UserRole).map((role) => (
                    <SelectItem
                      key={role}
                      value={role}
                      className="hover:bg-codedex-teal/20 focus:bg-codedex-teal/20"
                    >
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {updateError && (
              <p className="text-red-400 text-xs mt-2">Error: {updateError}</p>
            )}

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-700/50"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleUpdateRole}
                disabled={isUpdatingRole || selectedUser.role === selectedRole}
                className="bg-codedex-teal text-white hover:bg-codedex-teal/80"
              >
                {isUpdatingRole ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default withAdminAuth(AdminUsersPage);
