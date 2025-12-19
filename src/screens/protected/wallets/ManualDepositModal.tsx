// src/components/wallet/ManualDepositModal.tsx
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { formatCurrency } from '@/lib/utils';

const schema = z.object({
  amount: z.string().min(1, 'Amount is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Must be a valid positive number',
  }),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ManualDepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManualDepositModal({ open, onOpenChange }: ManualDepositModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // TODO: Replace with real API call
    console.log('Manual deposit submitted:', {
      amount: Number(data.amount),
      description: data.description || 'Manual self-funding',
    });

    // Simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reset();
    onOpenChange(false);
    // In real app: invalidate queries with queryClient.invalidateQueries({ queryKey: ['platform-wallet'] })
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manual Deposit (Self-Funding)</DialogTitle>
          <DialogDescription>
            Record a deposit into the cooperative wallet (e.g., cash or transfer from personal account).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="e.g., Cash deposit from chairman's office"
              {...register('description')}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Deposit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}