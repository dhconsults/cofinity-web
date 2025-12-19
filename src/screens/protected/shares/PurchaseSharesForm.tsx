import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { MEMBER_SHARE_ACCOUNT_API, SHARESPLAN_API } from "@/constants";
import { MemberSearchSelect } from "@/screens/Components/MemberSearchSelect"; // Reuse your existing component
import type { Member } from "@/types";
import type { SharesPlan } from "@/types/sharesPlan.type";
import type { SavingsAccount } from "@/types/savingsAccount.type";

const formSchema = z.object({
  member_id: z.number().int().positive("Select a valid member"),
  shares_plan_id: z.number().int().positive("Select a shares plan"),
  savings_account_id: z.number().int().positive("Select a savings account"),
  units: z.coerce.number().positive("Units must be greater than 0"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PurchaseSharesFormProps {
  onSuccess: () => void;
}

export default function PurchaseSharesForm({ onSuccess }: PurchaseSharesFormProps) {
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SharesPlan | null>(null);
  const [totalCost, setTotalCost] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member_id: undefined,
      shares_plan_id: undefined,
      savings_account_id: undefined,
      units: 1,
      description: "",
    },
  });

  // Fetch active shares plans
  const { data: plansResponse } = useQuery({
    queryKey: ["shares-plans"],
    queryFn: () => apiClient.get(SHARESPLAN_API.LIST).then(res =>  res.data.plans ),
  });

  // console.log(plansResponse.data.plans )

  const plans: SharesPlan[] = plansResponse || [];

  // Fetch member's savings accounts when member changes
  const { data: savingsAccounts = [] } = useQuery<SavingsAccount[]>({
    queryKey: ["member-savings-accounts", selectedMember?.id],
    queryFn: () =>
      selectedMember
        ? apiClient.get(`/api/members/${selectedMember.id}/savings-accounts`).then(res => res.data)
        : Promise.resolve([]),
    enabled: !!selectedMember,
  });

  // Real-time cost calculation
  useEffect(() => {
    const units = form.watch("units") || 0;
    if (selectedPlan) {
      setTotalCost(units * selectedPlan.unit_price);
    } else {
      setTotalCost(0);
    }
  }, [form.watch("units"), selectedPlan]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      apiClient.post(MEMBER_SHARE_ACCOUNT_API.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-share-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["member-share-accounts-quota"] });
      toast.success("Shares purchased successfully");
      onSuccess();
      form.reset();
      setSelectedMember(null);
      setSelectedPlan(null);
    },
    onError: (error: any) => {

      console.log(error)
      const message = error?.message || "Failed to purchase shares";
      toast.error("Error Occurred", {description: message } );
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Member Search */}
        {/* Member Search */}
<FormItem>
  <FormLabel>Member</FormLabel>
  <FormControl>
    <MemberSearchSelect
      value={selectedMember}
      onChange={(member) => {
        setSelectedMember(member);
        if (member) {
          form.setValue("member_id", member.id);
          // Reset dependent fields
          form.setValue("savings_account_id", undefined);
          form.setValue("shares_plan_id", undefined);
          setSelectedPlan(null);
        } else {
          form.setValue("member_id", undefined);
          form.setValue("savings_account_id", undefined);
          form.setValue("shares_plan_id", undefined);
          setSelectedPlan(null);
        }
        // Trigger validation
        form.trigger("member_id");
      }}
      placeholder="Type member name or ID..."
    />
  </FormControl>
  <FormMessage />
</FormItem>

        {/* Shares Plan */}
        <FormField
          control={form.control}
          name="shares_plan_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shares Plan</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(parseInt(value));
                  const plan = plans.find(p => p.id === parseInt(value));
                  setSelectedPlan(plan || null);
                }}
                disabled={!selectedMember}
              >
                <FormControl>
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select a shares plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent  >
                  {plans
                    .filter(plan => plan.is_active)
                    .map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()} >
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-xs text-gray-500">
                            ₦{plan.unit_price.toLocaleString()} per unit • Min: {plan.minimum_units}
                            {plan.maximum_units && ` • Max: ${plan.maximum_units}`}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Only active plans are shown. Default plan highlighted if available.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Savings Account to Debit */}
        <FormField
          control={form.control}
          name="savings_account_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Savings Account (Source of Funds)</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                disabled={!selectedMember || savingsAccounts.length === 0}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      savingsAccounts.length === 0
                        ? "No savings accounts found"
                        : "Select account to debit"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {savingsAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id.toString()}>
                      <div>
                        <p className="font-medium">{acc.account_number}</p>
                        <p className="text-xs text-gray-500">
                          Balance: ₦{parseFloat(acc.balance.toString()).toLocaleString()}
                        </p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Units */}
        <FormField
          control={form.control}
          name="units"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Units to Purchase</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={selectedPlan?.allow_partial_purchase ? "0.00000001" : "1"}
                  min={selectedPlan?.minimum_units || 1}
                  placeholder="e.g., 50"
                  {...field}
                />
              </FormControl>
              {selectedPlan && (
                <FormDescription>
                  Min: {selectedPlan.minimum_units} unit{selectedPlan.minimum_units > 1 ? "s" : ""}{' '}
                  {selectedPlan.maximum_units && `• Max: ${selectedPlan.maximum_units}`}{' '}
                  {!selectedPlan.allow_partial_purchase && "• Whole units only"}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total Cost Preview */}
        {selectedPlan && totalCost > 0 && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Cost</span>
                <span>₦{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {form.watch("units")} unit{form.watch("units") !== 1 ? "s" : ""} × ₦{selectedPlan.unit_price.toLocaleString()} per unit
              </p>
            </CardContent>
          </Card>
        )}

        {/* Optional Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Monthly share contribution" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={mutation.isPending || !selectedPlan || totalCost === 0}
            className="bg-black hover:bg-gray-900 text-white"
          >
            {mutation.isPending ? "Processing..." : "Purchase Shares"}
          </Button>
        </div>
      </form>
    </Form>
  );
}