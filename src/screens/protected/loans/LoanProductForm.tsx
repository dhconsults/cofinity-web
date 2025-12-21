import { useForm, Controller } from "react-hook-form";
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
import { LOANPRODUCT_API } from "@/constants";
import { useEffect } from "react";

const schema = z.object({
    name: z.string().min(3),
    prefix: z.string().regex(/^[A-Z0-9]+$/, "Uppercase letters/numbers only").min(2).max(8),
    starting_id: z.number().int().min(1),
    min_amount: z.number().min(100),
    max_amount: z.number().min(100),
    interest_rate: z.number().min(0).max(99.999),
    interest_type: z.enum(["flat", "reducing_balance"]),
    max_term: z.number().int().min(1),
    term_period: z.enum(["days", "weeks", "months", "years"]),
    late_penalty_rate: z.number().nullable(),
    application_fee: z.number().min(0),
    application_fee_type: z.enum(["fixed", "percentage"]),
    processing_fee: z.number().min(0),
    processing_fee_type: z.enum(["fixed", "percentage"]),
    description: z.string().optional(),
    guarantor_required: z.boolean(),
    is_active: z.boolean(),
}).refine((data) => data.max_amount >= data.min_amount, {
    message: "Max amount must be greater than min amount",
    path: ["max_amount"],
});

type FormData = z.infer<typeof schema>;

interface Props {
  product: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LoanProductForm({ product, onSuccess, onCancel }: Props) {
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product || {
      interest_type: "flat",
      term_period: "months",
      application_fee_type: "fixed",
      processing_fee_type: "fixed",
      is_active: true,
      guarantor_required: false,
      late_penalty_rate: null,
      application_fee: 0,
      processing_fee: 0,
    },
  });

const watchAllFields = watch();

useEffect(() => {
    console.log("Form Data:", watchAllFields);
}, [watchAllFields]);

  const mutation = useMutation({

   

    mutationFn: (data: FormData) =>
      isEdit ? apiClient.put(LOANPRODUCT_API.UPDATE(product.id), data) : apiClient.post(LOANPRODUCT_API.CREATE, data),
    onSuccess,
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Operation failed", {description: err.message});
    },
  });

  return (
  
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Product Name *</Label>
          <Input {...register("name")} placeholder="Personal Loan" />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Prefix *</Label>
          <Input {...register("prefix")} placeholder="PL" className="uppercase" />
          {errors.prefix && <p className="text-sm text-red-600 mt-1">{errors.prefix.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Starting ID *</Label>
          <Input type="number" {...register("starting_id", { valueAsNumber: true })} />
          {errors.starting_id && <p className="text-sm text-red-600 mt-1">{errors.starting_id.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea {...register("description")} rows={3} />
      </div>

      {/* Amount & Term */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Min Amount *</Label>
          <Input type="number" {...register("min_amount", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Max Amount *</Label>
          <Input type="number" {...register("max_amount", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Max Term *</Label>
          <Input type="number" {...register("max_term", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Period *</Label>
          <Select onValueChange={(v) => setValue("term_period", v as any)} defaultValue={watch("term_period")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Interest */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Interest Rate (%) *</Label>
          <Input type="number" step="0.001" {...register("interest_rate", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Interest Type *</Label>
          <Select onValueChange={(v) => setValue("interest_type", v as any)} defaultValue={watch("interest_type")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">Flat Rate</SelectItem>
              <SelectItem value="reducing_balance">Reducing Balance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Late Penalty (% per day)</Label>
          <Input type="number" step="0.001" {...register("late_penalty_rate", { valueAsNumber: true })} />
        </div>
      </div>

      {/* Fees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Application Fee</Label>
          <div className="flex gap-2">
            <Input type="number" step="0.01" {...register("application_fee", { valueAsNumber: true })} />
            <Select onValueChange={(v) => setValue("application_fee_type", v as any)} defaultValue={watch("application_fee_type")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="percentage">%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Processing Fee</Label>
          <div className="flex gap-2">
            <Input type="number" step="0.01" {...register("processing_fee", { valueAsNumber: true })} />
            <Select onValueChange={(v) => setValue("processing_fee_type", v as any)} defaultValue={watch("processing_fee_type")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="percentage">%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* Requirements */}

      
     <div className="flex items-center space-x-2">
  <Controller
    name="guarantor_required"
    control={control}
    render={({ field }) => (
      <Checkbox 
        id="guarantor" 
        checked={field.value} 
        onCheckedChange={(checked) => field.onChange(checked)}
      />
    )}
  />
  <Label htmlFor="guarantor">Guarantor Required</Label>
</div>

<div className="flex items-center space-x-2">
  <Controller
    name="is_active"
    control={control}
    render={({ field }) => (
      <Checkbox 
        id="active" 
        checked={field.value} 
        onCheckedChange={(checked) => field.onChange(checked)}
      />
    )}
  />
  <Label htmlFor="active">Active</Label>
</div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => onCancel()}>
          Cancel
        </Button>


        {/* <Button type="submit" disabled={isSubmitting} className="bg-black hover:bg-gray-900 text-white">
          {isSubmitting ? (
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
        </Button> */}


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