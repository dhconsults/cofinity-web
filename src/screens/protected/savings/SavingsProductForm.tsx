// src/pages/savings-products/SavingsProductForm.tsx
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { SAVINGPRODUCT_API } from "@/constants";

const schema = z.object({
  name: z.string().min(3, "Name is required"),
  account_prefix: z.string()
    .regex(/^[A-Z0-9]+$/, "Only uppercase letters and numbers")
    .min(2, "Minimum 2 characters")
    .max(8, "Maximum 8 characters"),
  yearly_interest_rate: z.number().min(0).max(99.999),
  interest_period: z.enum(["monthly", "quarterly", "semi_annually", "annually"]),
  interest_method: z.enum(["daily_balance", "average_balance", "minimum_balance"]),
  min_balance_for_interest: z.number().min(0),
  allow_withdrawal: z.boolean(),
  min_deposit_amount: z.number().min(0),
  min_account_balance: z.number().min(0),
  maintenance_fee: z.number().min(0),
  maintenance_fee_month: z.string().nullable(),
  auto_create_on_registration: z.boolean(),
  is_default: z.boolean(),
  is_active: z.boolean(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  product: any;
  onSuccess: () => void;
}

export default function SavingsProductForm({ product, onSuccess }: Props) {
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product || {
      yearly_interest_rate: 0,
      min_balance_for_interest: 0,
      min_deposit_amount: 0,
      min_account_balance: 0,
      maintenance_fee: 0,
      maintenance_fee_month: null,
      allow_withdrawal: true,
      auto_create_on_registration: false,
      is_default: false,
      is_active: true,
      interest_period: "annually",
      interest_method: "daily_balance",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit
        ? apiClient.put(SAVINGPRODUCT_API.UPDATE(product.id), data)
        : apiClient.post(SAVINGPRODUCT_API.CREATE, data),
    onSuccess,
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Operation failed");
    },
  });

  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Product Name *</Label>
            <Input {...register("name")} placeholder="Regular Savings" />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Account Prefix *</Label>
            <Input {...register("account_prefix")} placeholder="SV" className="uppercase font-mono" />
            {errors.account_prefix && <p className="text-sm text-red-600 mt-1">{errors.account_prefix.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={2} placeholder="Optional description" />
          </div>
        </div>
      </div>

      {/* Interest Settings */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-black">Interest Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Yearly Interest Rate (%)</Label>
            <Input type="number" step="0.001" {...register("yearly_interest_rate", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Interest Period</Label>
            <Select onValueChange={(v) => setValue("interest_period", v as any)} defaultValue={watch("interest_period")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Every 1 month</SelectItem>
                <SelectItem value="quarterly">Every 3 months</SelectItem>
                <SelectItem value="semi_annually">Every 6 months</SelectItem>
                <SelectItem value="annually">Every 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Interest Method</Label>
            <Select onValueChange={(v) => setValue("interest_method", v as any)} defaultValue={watch("interest_method")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily_balance">Daily Outstanding Balance</SelectItem>
                <SelectItem value="average_balance">Average Balance</SelectItem>
                <SelectItem value="minimum_balance">Minimum Balance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Min Balance for Interest</Label>
            <Input type="number" {...register("min_balance_for_interest", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      {/* Account Rules */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-black">Account Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Minimum Deposit Amount</Label>
            <Input type="number" {...register("min_deposit_amount", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Minimum Account Balance</Label>
            <Input type="number" {...register("min_account_balance", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Allow Withdrawal</Label>
            <Select onValueChange={(v) => setValue("allow_withdrawal", v === "true")} defaultValue={watch("allow_withdrawal") ? "true" : "false"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Maintenance Fee */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-black">Maintenance Fee</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Maintenance Fee Amount</Label>
            <Input type="number" step="0.01" {...register("maintenance_fee", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Deduct In</Label>
            <Select onValueChange={(v) => setValue("maintenance_fee_month", v || null)} defaultValue={watch("maintenance_fee_month") || ""}>
              <SelectTrigger>
                <SelectValue placeholder="No maintenance fee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No maintenance fee</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Automation & Status */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-black">Automation & Status</h3>
        <div className="space-y-4">
          


         
       
       



        
              
         <div className="flex items-center space-x-2">
          <Controller
            name="auto_create_on_registration"
            control={control}
            render={({ field }) => (
              <Checkbox 
                id="auto_create_on_registration" 
                checked={field.value} 
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            )}
          />
          <Label htmlFor="auto_create_on_registration">   Auto-create account after member registration </Label>
        </div>
              
         <div className="flex items-center space-x-2">
          <Controller
            name="is_default"
            control={control}
            render={({ field }) => (
              <Checkbox 
                id="is_default" 
                checked={field.value} 
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            )}
          />
          <Label htmlFor="is_default">     Set as default product (only one allowed) </Label>
        </div>


         <div className="flex items-center space-x-2">
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Checkbox 
                id="is_active" 
                checked={field.value} 
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            )}
          />
          <Label htmlFor="is_active">      Active </Label>
        </div>



      </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
    


          <Button 
                type="submit" 
                disabled={mutation.isPending} 
                className="bg-black hover:bg-gray-900 text-white"
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  `${isEdit ? "Update" : "Create"} Product`
                )}
              </Button>
      </div>
    </form>
  );
}