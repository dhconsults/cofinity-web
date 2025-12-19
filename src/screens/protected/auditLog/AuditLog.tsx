// src/app/audit/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Eye,
  Filter,
  Calendar,
  User,
  Activity,
  Download,
  RefreshCw,
  Loader2,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
  
interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  userId: string | null;
  action: 'created' | 'updated' | 'deleted';
  model: string;
  modelId: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
}

interface AuditResponse {
  data: {
    data: AuditLog[];
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
  stats: {
    totalLogs: number;
    created: number;
    updated: number;
    deleted: number;
  };
  unique_models: string[];
}

// Format date and time
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Action Badge
const ActionBadge = ({ action }: { action: string }) => {
  const config = {
    created: { label: 'Created', className: 'bg-green-100 text-green-800 border-green-200' },
    updated: { label: 'Updated', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    deleted: { label: 'Deleted', className: 'bg-red-100 text-red-800 border-red-200' },
  }[action] || { label: action, className: 'bg-gray-100 text-gray-800' };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

// Model Badge
const ModelBadge = ({ model }: { model: string }) => {
  const colorMap: Record<string, string> = {
    Member: 'bg-purple-100 text-purple-800 border-purple-200',
    Loan: 'bg-blue-100 text-blue-800 border-blue-200',
    LoanRepayment: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Expense: 'bg-orange-100 text-orange-800 border-orange-200',
    PlatformTransaction: 'bg-teal-100 text-teal-800 border-teal-200',
    SavingsAccount: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    User: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <Badge variant="outline" className={colorMap[model] || 'bg-gray-100 text-gray-800'}>
      {model}
    </Badge>
  );
};

export default function AuditLogPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [perPage, setPerPage] = useState('25');
  const [actionFilter, setActionFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const isOwnerOrAdmin = ['owner', 'admin'].includes(user?.role || '');

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery<AuditResponse>({
    queryKey: ['audit-logs', { searchQuery, perPage, actionFilter, modelFilter }],
    queryFn: () =>
      apiClient
        .get('/api/audit-logs', {
          params: {
            search: searchQuery || undefined,
            action: actionFilter === 'all' ? undefined : actionFilter,
            model: modelFilter === 'all' ? undefined : modelFilter,
            per_page: perPage,
          },
        })
        .then((res) => res.data),
    staleTime: 1000 * 60, // 1 minute
  });

  const logs = response?.data.data || [];
  const stats = response?.stats || { totalLogs: 0, created: 0, updated: 0, deleted: 0 };
  const uniqueModels = response?.unique_models || [];

  const handleRefresh = () => {
    refetch();
    toast.success('Refreshed', { description: 'Audit logs updated.' });
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsViewDialogOpen(true);
  };

  if (!isOwnerOrAdmin) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Access denied. Only owners and admins can view audit logs.
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load audit logs. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-600 mt-1">Track all system activities and user actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2" disabled>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-black">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Total Activities
            </CardDescription>
            <CardTitle className="text-2xl">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalLogs}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">All logged activities</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              Created Actions
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.created}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">New records created</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              Updated Actions
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.updated}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Records modified</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              Deleted Actions
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.deleted}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Records deleted</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <CardTitle>Activity Log</CardTitle>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-700">Show</span>
                <Select value={perPage} onValueChange={setPerPage}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>

              <Select value={modelFilter} onValueChange={setModelFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {uniqueModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Timestamp</TableHead>
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                  <TableHead className="font-semibold">Model</TableHead>
                  <TableHead className="font-semibold">Model ID</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">IP Address</TableHead>
                  <TableHead className="font-semibold text-center">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{formatDateTime(log.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{log.user}</div>
                            {log.userId && <div className="text-xs text-gray-500">{log.userId}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionBadge action={log.action} />
                      </TableCell>
                      <TableCell>
                        <ModelBadge model={log.model} />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.modelId}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{log.description}</p>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{log.ipAddress}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewDetails(log)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Info */}
          {!isLoading && logs.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {logs.length} of {response?.data.total || 0} logs
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>Complete information about this activity</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">Timestamp</Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{formatDateTime(selectedLog.timestamp)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">User</Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium">{selectedLog.user}</div>
                      {selectedLog.userId && <div className="text-xs text-gray-500">{selectedLog.userId}</div>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">Action</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <ActionBadge action={selectedLog.action} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">Model</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <ModelBadge model={selectedLog.model} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">Model ID</Label>
                  <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">{selectedLog.modelId}</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">IP Address</Label>
                  <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">{selectedLog.ipAddress}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-600">Description</Label>
                <div className="p-3 bg-gray-50 rounded-md">{selectedLog.description}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-600">User Agent</Label>
                <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 break-all">
                  {selectedLog.userAgent}
                </div>
              </div>

              {selectedLog.oldValues && (
                <div className="space-y-2">
                  <Label className="text-gray-600">Old Values</Label>
                  <div className="p-4 bg-red-50 rounded-md border border-red-200">
                    <pre className="text-sm text-gray-800 overflow-x-auto">
                      {JSON.stringify(selectedLog.oldValues, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {selectedLog.newValues && (
                <div className="space-y-2">
                  <Label className="text-gray-600">New Values</Label>
                  <div className="p-4 bg-green-50 rounded-md border border-green-200">
                    <pre className="text-sm text-gray-800 overflow-x-auto">
                      {JSON.stringify(selectedLog.newValues, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}