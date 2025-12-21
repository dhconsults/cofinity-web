// src/components/settings/PayoutAccountModal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
 
const schema = z.object({
  bank_code: z.string().min(1, 'Select a bank'),
  account_number: z.string().length(10, 'Must be 10 digits'),
});

type FormData = z.infer<typeof schema>;

interface Bank {
  id: number;
  code: string;
  name: string;
}

interface PayoutAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
      bank_code: string; account_name: string; account_number: string; bank_name: string 
}) => void;
}

export default function PayoutAccountModal({ open, onOpenChange, onSave }: PayoutAccountModalProps) {
  const [verification, setVerification] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const { data: banks = [] } = useQuery<Bank[]>({
    queryKey: ['banks'],
    queryFn: () => apiClient.get('/api/banks').then(res => res.data),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const bankCode = watch('bank_code');
  const accountNumber = watch('account_number');

  const verifyAccount = async () => {
    if (!bankCode || accountNumber.length !== 10) return;

    setVerifying(true);
    setVerifyError(null);
    setVerification(null);

    try {
      const res = await apiClient.post('/banks/verify', {
        bank_code: bankCode,
        account_number: accountNumber,
      });
      setVerification(res.data.data);
    } catch (err: any) {
      setVerifyError(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!verification) {
      toast.warning(  'Verify First', { description: 'Please verify the account number.', variant: 'destructive' });
      return;
    }
    onSave({
      account_name: verification.account_name,
      account_number: verification.account_number,
      bank_name: verification.bank_name,
    });
    reset();
    setVerification(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Payout Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Bank</Label>
            <Select onValueChange={(v) => setValue('bank_code', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.code}>{bank.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bank_code && <p className="text-sm text-destructive">{errors.bank_code.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input
              placeholder="0123456789"
              maxLength={10}
              {...register('account_number')}
              onBlur={verifyAccount}
            />
            {errors.account_number && <p className="text-sm text-destructive">{errors.account_number.message}</p>}
          </div>

          <div className="min-h-[40px]">
            {verifying && (
              <Alert><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</Alert>
            )}
            {verification && (
              <Alert className="border-green-600 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>{verification.account_name}</strong><br />
                  <span className="text-xs">{verification.bank_name}</span>
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

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !verification}>
              Save Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}