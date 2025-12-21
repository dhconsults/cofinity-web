// src/pages/dividends/DeclareDividendForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";

const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  rate: z.coerce.number().min(0.01).max(100),
  shares_plan_id: z.string().optional(),
  declaration_date: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface DeclareDividendFormProps {
  onSuccess: () => void;
}

export default function DeclareDividendForm({ onSuccess }: DeclareDividendFormProps) {
  const queryClient = useQueryClient();

  const { data: plans } = useQuery({
    queryKey: ["shares-plans"],
    queryFn: () => apiClient.get("/api/shares-plans").then(res => res.data.plans),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      rate: 5,
      shares_plan_id: "",
      declaration_date: new Date().toISOString().split("T")[0],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => apiClient.post("/api/dividends", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividends"] });
      onSuccess();
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to declare dividend");
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dividend Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2025 Annual Dividend" {...field} />
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
                <Textarea placeholder="Details about this dividend..." rows={3} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dividend Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>e.g., 5% of share value</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shares_plan_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shares Plan (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All plans" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="allPlans" >All Active Plans</SelectItem>
                    {plans?.filter((p: any) => p.is_active).map((plan: any) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Leave blank for all plans</FormDescription>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="declaration_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Declaration Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-black hover:bg-gray-900 text-white"
          >
            {mutation.isPending ? "Declaring..." : "Declare Dividend"}
          </Button>
        </div>
      </form>
    </Form>
  );
}