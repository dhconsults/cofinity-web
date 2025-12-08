// src/components/member/SendEmail.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function SendEmail({ member }: { member: any }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!subject || !message) {
      toast.error("Please fill subject and message");
      return;
    }
    toast.success(`Email sent to ${member.email}`);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Send Email</h2>
      <Card className="p-6 space-y-6">
        <div>
          <label className="text-sm font-medium">To</label>
          <Input value={member.email} disabled className="mt-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Subject</label>
          <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter subject" className="mt-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Message</label>
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
            rows={8}
            className="mt-2"
          />
        </div>
        <Button onClick={handleSend} className="w-full bg-black hover:bg-neutral-900">
          Send Email
        </Button>
      </Card>
    </div>
  );
}