// src/app/wallet/page.tsx
'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Banknote, ArrowUpCircle, Settings, Clock, DollarSign } from 'lucide-react';
 import { apiClient } from '@/lib/api-client'; 
import { useState, useCallback } from 'react';
  import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/formatCurrency';
import WithdrawModal from './WithdrawModal';

interface WalletData {
  platform_balance: number;
  unsettled_balance: number;
  total_platform_deposits: number;
  total_unsettled_deposits: number;
  total_platform_withdrawals: number;
  main_virtual_bank: string;
  main_virtual_number: string;
  nomba_account_ref: string;
  auto_sweep_enabled: boolean;
  sweep_bank_name?: string;
  sweep_account_name?: string;
  sweep_account_number?: string;
}

interface PlatformTransaction {
  id: number;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
  meta: Record<string, any>;
}

export default function WalletPage() {
  const { user } = useAuth();



  const router = useNavigate();



  const queryClient = useQueryClient();
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const isOwnerOrAdmin = ['owner', 'admin'].includes(user?.role || '');

  const {
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
  } = useQuery<WalletData>({
    queryKey: ['platform-wallet'],
    queryFn: () => apiClient.get('/api/platform/wallet').then((res) => res.data),
  });

  const {
    data: transactionsResponse,
    isLoading: txLoading,
    error: txError,
  } = useQuery<{
    data: PlatformTransaction[];
    // pagination meta if needed
  }>({
    queryKey: ['platform-transactions'],
    queryFn: () => apiClient.get('/api/platform/transactions').then((res) => res),
  });

  const transactions = transactionsResponse?.data || [];

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success( `${label} copied!`, {
     
      description: text,
       
    });
  }, []);

  const handleAutoSweepSettings = () => {
    router('/settings/auto-sweep');
  };

  if (!isOwnerOrAdmin) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Access denied. Only owners and admins can view the wallet.
      </div>
    );
  }

  if (walletError || txError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load wallet data. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cooperative Wallet</h1>
          <p className="text-muted-foreground">Real-time funds received via Nomba virtual account</p>
        </div>
        <Button  onClick={handleAutoSweepSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Auto-Sweep Settings
        </Button>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsettled (Pending)</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {walletLoading ? '—' : formatCurrency(wallet?.unsettled_balance || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Settles in 24 hours</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {walletLoading ? '—' : formatCurrency(wallet?.platform_balance || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {walletLoading
                ? '—'
                : formatCurrency(
                    (wallet?.total_platform_deposits || 0) + (wallet?.total_unsettled_deposits || 0)
                  )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {walletLoading ? '—' : formatCurrency(wallet?.total_platform_withdrawals || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nomba Virtual Account Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Receive Member Contributions
          </CardTitle>
          <CardDescription>
            Share these details with members. All transfers instantly credit your unsettled balance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Bank Name</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-lg">
                  {walletLoading ? '—' : wallet?.main_virtual_bank || 'Not configured'}
                </p>
                {!walletLoading && wallet?.main_virtual_bank && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(wallet.main_virtual_bank, 'Bank name')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Account Number</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-xl tracking-wider">
                  {walletLoading ? '—' : wallet?.main_virtual_number || '—'}
                </p>
                {!walletLoading && wallet?.main_virtual_number && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(wallet.main_virtual_number, 'Account number')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Reference (Optional)</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  {walletLoading ? '—' : wallet?.nomba_account_ref || '—'}
                </p>
                {!walletLoading && wallet?.nomba_account_ref && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(wallet.nomba_account_ref, 'Reference')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button onClick={() => setWithdrawOpen(true)} size="lg" >
          <ArrowUpCircle className="mr-2 h-5 w-5" />
          Withdraw to Bank
        </Button>
        {wallet?.auto_sweep_enabled && (
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            Auto-Sweep Enabled
          </Badge>
        )}
      </div>

      <Separator />

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All platform deposits, settlements, and withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{new Date(tx.created_at).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.type === 'platform_deposit_unsettled'
                            ? 'secondary'
                            : tx.type === 'platform_deposit_settled'
                            ? 'default'
                            : tx.type === 'platform_withdrawal'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {tx.type
                          .replace('platform_', '')
                          .replace('_', ' ')
                          .toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{tx.description || '—'}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        tx.type.includes('deposit') ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type.includes('deposit') ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(tx.balance_after)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <WithdrawModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        currentBalance={wallet?.platform_balance || 0}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['platform-wallet'] });
          queryClient.invalidateQueries({ queryKey: ['platform-transactions'] });
        }}
      />
    </div>
  );
}