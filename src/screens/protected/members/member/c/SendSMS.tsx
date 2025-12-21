// src/components/member/SendSMS.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle, Send, Clock, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";

const templates = [
  "Your monthly savings of ₦{target} is due. Please fund your account.",
  "Congratulations! Your loan has been approved and disbursed.",
  "Reminder: Cooperative meeting this Saturday at 10 AM.",
  "Your account balance is ₦{balance}. Thank you for saving with us!",
];

export default function SendSMS({ member }: { member: any }) {
  const [message, setMessage] = useState("");

  const sendSMS = useMutation({
    mutationFn: () => apiClient.post(MEMBERS_API.SENDSMS(member.id), { message }),
    onSuccess: () => {
      toast.success("SMS sent successfully!");
      setMessage("");
    },
    onError: () => toast.error("Failed to send SMS"),
  });

  const charsLeft = 160 - message.length;
  const pages = Math.ceil(message.length / 160);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <MessageCircle className="w-10 h-10 text-green-600" />
            Send SMS
          </h2>
          <p className="text-neutral-600 mt-1">Instant message to {member.first_name}</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {member.phone}
        </Badge>
      </div>

      <Card className="p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/30 border-green-200 shadow-xl">
        <div className="space-y-6">
          {/* Templates */}
          <div>
            <p className="text-sm font-semibold text-neutral-700 mb-3">Quick Templates</p>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((t, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-3 hover:bg-green-50"
                  onClick={() => setMessage(t
                    .replace("{target}", Number(member.monthly_savings_target || 0).toLocaleString())
                    .replace("{balance}", Number(member.total_savings || 0).toLocaleString())
                  )}
                >
                  {t.split(".")[0]}...
                </Button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4" />
              Message ({pages} page{pages > 1 ? "s" : ""})
            </label>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 480))}
              placeholder="Type your SMS here..."
              rows={8}
              className="text-base leading-relaxed resize-none font-mono"
            />
            <div className="mt-3 flex justify-between items-center">
              <span className={`text-sm font-medium ${charsLeft < 20 ? "text-red-600" : "text-neutral-600"}`}>
                {charsLeft} characters left
              </span>
              <Progress value={(message.length / 160) * 100} className="w-32 h-2" />
            </div>
          </div>

          {/* Send */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              onClick={() => sendSMS.mutate()}
              disabled={!message.trim() || sendSMS.isPending}
            >
              {sendSMS.isPending ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send SMS
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}