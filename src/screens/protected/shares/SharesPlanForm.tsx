// src/pages/shares-plans/SharesPlanForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { SHARESPLAN_API } from "@/constants";
import type { SharesPlan } from "@/types/sharesPlan.type";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  description: z.string().nullable().optional(),
  unit_price: z.coerce.number().positive("Unit price must be greater than 0"),
  minimum_units: z.coerce.number().int().min(1, "Minimum units must be at least 1"),
  maximum_units: z.coerce.number().int().nullable().optional(),
  allow_partial_purchase: z.boolean().default(false),
  is_default: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface SharesPlanFormProps {
  plan: SharesPlan | null;
  onSuccess: () => void;
}

export default function SharesPlanForm({ plan, onSuccess }: SharesPlanFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: plan?.name ?? "",
      description: plan?.description ?? "",
      unit_price: plan?.unit_price ?? 1000,
      minimum_units: plan?.minimum_units ?? 1,
      maximum_units: plan?.maximum_units ?? null,
      allow_partial_purchase: plan?.allow_partial_purchase ?? false,
      is_default: plan?.is_default ?? false,
      is_active: plan?.is_active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = {
        ...data,
        maximum_units: data.maximum_units || null,
        description: data.description || null,
      };

      if (plan) {
        return apiClient.put(SHARESPLAN_API.DELETE(plan.id), payload);
      }
      return apiClient.post(SHARESPLAN_API.LIST, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares-plans"] });
      queryClient.invalidateQueries({ queryKey: ["shares-plans-quota"] });
      toast.success(plan ? "Shares plan updated successfully" : "Shares plan created successfully");
      onSuccess();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Ordinary Shares" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this share plan..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Price (₦)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="1000.00" {...field} />
                </FormControl>
                <FormDescription>Price per share unit</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimum_units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Units</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormDescription>Minimum shares a member can buy</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="maximum_units"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Units (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Leave empty for no limit"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? null : parseInt(val));
                  }}
                />
              </FormControl>
              <FormDescription>Maximum shares per member (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="allow_partial_purchase"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Allow Partial Purchase</FormLabel>
                  <FormDescription>
                    If enabled, members can buy fractions of a share unit (rarely used)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_default"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Set as Default Plan</FormLabel>
                  <FormDescription>
                    Only one plan can be default. Used for automatic share allocation on registration.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {!plan && (
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active by Default</FormLabel>
                    <FormDescription>New plans are active by default</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={mutation.isPending} className="bg-black hover:bg-gray-900 text-white">
            {mutation.isPending ? "Saving..." : plan ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}