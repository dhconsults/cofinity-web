'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/formatCurrency';

import { toast } from 'sonner';

const schema = z.object({
  amount: z.string().min(1, 'Amount is required').refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 1000;
  }, { message: 'Minimum withdrawal is ₦1,000' }),
  bank_code: z.string().min(1, 'Please select a bank'),
  account_number: z.string().length(10, 'Account number must be 10 digits'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
});

type FormData = z.infer<typeof schema>;

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onSuccess?: () => void;
}

interface Bank {
  id: number;
  code: string;
  name: string;
  short_name?: string;
}

interface VerificationResult {
  account_name: string;
  account_number: string;
  bank_name: string;
}

export default function WithdrawModal({
  open,
  onOpenChange,
  currentBalance,
  onSuccess,
}: WithdrawModalProps) {
  const queryClient = useQueryClient();
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      bank_code: '',
      account_number: '',
      description: '',
    },
  });

  const watchedBankCode = watch('bank_code');
  const watchedAccountNumber = watch('account_number');

  // Fetch banks
  const { data: banks = [], isLoading: banksLoading } = useQuery<Bank[]>({
    queryKey: ['banks'],
    queryFn: () => apiClient.get('/api/banks').then((res) => res.data),
  });

  // Verify account number (debounced manually on blur)
  const verifyAccount = async () => {
    if (!watchedBankCode || watchedAccountNumber.length !== 10) return;

    setVerifying(true);
    setVerifyError(null);
    setVerification(null);

    try {
      const res = await apiClient.post('/api/banks/verify', {
        bank_code: watchedBankCode,
        account_number: watchedAccountNumber,
      });

      setVerification(res.data);
      toast.success( 'Account Verified', {
        description: `Resolved to: ${res.data.account_name}`,
      });

    } catch (err: any) {
      const message = err?.message || 'Verification failed';
      setVerifyError(message);
      setVerification(null);
    } finally {
      setVerifying(false);
    }
  };

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: (data: FormData) =>
      apiClient.post('/platform/withdraw', {
        amount: Number(data.amount),
        description: data.description,
        // Optional: send bank details for audit (not needed for payout since we use sweep account)
      }),
    onSuccess: () => {
      toast.success( 'Withdrawal Successful',{
        description: 'Funds have been queued for transfer to your sweep account.',
      });
      reset();
      setVerification(null);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error( 'Withdrawal Failed',{
        description: err?.message || 'Please try again',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (Number(data.amount) > currentBalance) {
      toast.error( 'Insufficient Balance',{
        description: `Available: ${formatCurrency(currentBalance)}`,
      });
      return;
    }

    if (!verification) {
      toast.error( 'Verify Account First',{
        description: 'Please verify the account number before withdrawing.',
      });
      return;
    }

    withdrawMutation.mutate(data);
  };

  // Reset verification when inputs change
  const handleAccountNumberBlur = () => {
    if (watchedAccountNumber.length === 10 && watchedBankCode) {
      verifyAccount();
    }
  };

  const handleBankChange = (value: string) => {
    setValue('bank_code', value);
    setVerification(null);
    setVerifyError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Withdraw to Sweep Bank Account</DialogTitle>
          <DialogDescription>
            Transfer funds from your available balance to your configured sweep account.
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-4">
          Available Balance: <span className="font-semibold">{formatCurrency(currentBalance)}</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="50000"
              {...register('amount')}
            />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <Label htmlFor="bank">Bank</Label>
            <Select onValueChange={handleBankChange} disabled={banksLoading}>
              <SelectTrigger>
                <SelectValue placeholder={banksLoading ? 'Loading banks...' : 'Select a bank'} />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.code}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bank_code && <p className="text-sm text-destructive">{errors.bank_code.message}</p>}
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              placeholder="0123456789"
              maxLength={10}
              {...register('account_number')}
              onBlur={handleAccountNumberBlur}
            />
            {errors.account_number && (
              <p className="text-sm text-destructive">{errors.account_number.message}</p>
            )}
          </div>

          {/* Verification Status */}
          <div className="min-h-[40px]">
            {verifying && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>Verifying account...</AlertDescription>
              </Alert>
            )}

            {verification && (
              <Alert className="border-green-600 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Verified: <strong>{verification.account_name}</strong>
                  <br />
                  <span className="text-xs">{verification.bank_name} • {verification.account_number}</span>
                </AlertDescription>
              </Alert>
            )}

            {verifyError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{verifyError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Purpose / Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Payment for operational expenses"
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                withdrawMutation.isPending ||
                !verification ||
                Number(watch('amount') || 0) > currentBalance ||
                Number(watch('amount') || 0) < 1000
              }
            >
              {isSubmitting || withdrawMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Request Withdrawal'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}