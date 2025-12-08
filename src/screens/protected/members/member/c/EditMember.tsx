// src/components/member/EditMember.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

export default function EditMember({ member }: { member: any }) {
  const [form, setForm] = useState(member);

  const updateMember = useMutation({
  mutationFn: (data) => apiClient.put(`/members/${member.id}`, data),
  onSuccess: () => {
    toast.success("Member updated!");
    queryClient.invalidateQueries({ queryKey: ["member", member.id] });
  },
});

  const handleSave = () => {
    toast.success("Member details updated successfully!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Member Details</h2>
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="First Name" value={form.first_name} onChange={v => setForm({ ...form, first_name: v })} />
          <Input label="Last Name" value={form.last_name} onChange={v => setForm({ ...form, last_name: v })} />
          <Input label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
          <Input label="Email" value={form.email || ""} onChange={v => setForm({ ...form, email: v })} />
        </div>
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} className="bg-black hover:bg-neutral-900">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}