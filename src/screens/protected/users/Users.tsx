'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'; 

import { UserPlus, Trash2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

 

interface TenantUser {
  id: number;
  full_name: string;
  email: string;
  role: 'owner' | 'admin';
  is_current_user: boolean;
  can_delete: boolean;
}

export default function TenantUsersPage() { 
  const queryClient = useQueryClient();

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'admin' as 'admin' | 'owner',
  });

  // Fetch users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<TenantUser[]>({
    queryKey: ['tenant-users'],
    queryFn: () =>  apiClient.get('/api/tenant-users').then((res) => res.data.users),
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/api/tenant-users', data),
    onSuccess: () => {
      toast.success('Successfully added user', { description: 'User added successfully' });
      queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
      setOpenAddDialog(false);
      setForm({ first_name: '', last_name: '', email: '', password: '', password_confirmation: '', role: 'admin' });
    },
    onError: (err: any) => {
      toast.error('Error', {
        description: err?.message || 'Failed to add user', 
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: 'admin' | 'owner' | 'secretary' }) =>
      apiClient.put(`/api/tenant-users/${id}`, { role }),
    onSuccess: () => {
      toast.success('Success', { description: 'Role updated' });
      queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
    },
    onError: (err: any) => toast.error('Error', { description: err?.message || err.error || 'Failed to update role' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/tenant-users/${id}`),
    onSuccess: () => {
      toast.success('Success', { description: 'User removed' });
      queryClient.invalidateQueries({ queryKey: ['tenant-users'] });
    },
    onError: () => toast.error('Error', { description: 'Failed to remove user' }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(form);
  };



  const { data: adminUsage } = useQuery({
  queryKey: ['admin-usage'],
  queryFn: () => apiClient.get('/api/tenant-users/usage/admin').then(res => res.data.usage),
});



  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage admins and owners for this cooperative.
          </p>

           {adminUsage && (
        <p className="text-sm text-muted-foreground mt-1">
          Admins: <strong>{adminUsage.used}</strong> / {adminUsage.limit}
          {adminUsage.remaining !== '∞' && ` (${adminUsage.remaining} remaining)`}
        </p>
      )}
        </div>


      



        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button disabled={!adminUsage?.can_add_more}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new admin or owner account for this cooperative.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>

              <div>
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v as 'admin' | 'owner' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="secretary">Secretary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? 'Adding...' : 'Add User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-destructive text-center py-8">Failed to load team members</p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No team members yet. Add one above.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name}
                      {user.is_current_user && <Badge variant="secondary" className="ml-2">You</Badge>}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(val) => updateRoleMutation.mutate({ id: user.id, role: val as 'admin' | 'owner' })}
                        disabled={updateRoleMutation.isPending || !user.can_delete}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                                              <SelectItem value="secretary">Secretary</SelectItem>

                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      {user.can_delete && !user.is_current_user && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(user.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}