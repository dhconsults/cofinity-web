// src/components/member/SendSMS.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function SendSMS({ member }: { member: any }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    toast.success(`SMS sent to ${member.phone}`);
    setMessage("");
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Send SMS</h2>
      <Card className="p-6 space-y-6">
        <div>
          <label className="text-sm font-medium">To</label>
          <Input value={member.phone} disabled className="mt-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Message ({message.length}/160)</label>
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value.slice(0, 160))}
            placeholder="Type your SMS..."
            rows={5}
            className="mt-2"
          />
        </div>
        <Button onClick={handleSend} className="w-full bg-black hover:bg-neutral-900">
          Send SMS
        </Button>
      </Card>
    </div>
  );
}