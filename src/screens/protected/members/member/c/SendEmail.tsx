// src/components/member/SendEmail.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Send, Paperclip, Smile, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";

const templates = [
  { name: "Welcome Message", subject: "Welcome to the Cooperative!", body: "Dear {name},\n\nWelcome to our cooperative family! We're excited to have you..." },
  { name: "Savings Reminder", subject: "Monthly Savings Reminder", body: "Hi {name},\n\nThis is a friendly reminder to complete your monthly savings of ₦{target}..." },
  { name: "Loan Approval", subject: "Your Loan Has Been Approved!", body: "Congratulations {name}!\n\nYour loan of ₦{amount} has been approved and disbursed..." },
];

export default function SendEmail({ member }: { member: any }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = useMutation({
    mutationFn: () => apiClient.post(MEMBERS_API.SENDEMAIL(member.id), { subject, message }),
    onSuccess: () => {
      toast.success("Email sent successfully!");
      setSubject("");
      setMessage("");
    },
    onError: () => toast.error("Failed to send email"),
  });

  const applyTemplate = (template: typeof templates[0]) => {
    setSubject(template.subject.replace("{name}", member.first_name));
    setMessage(template.body
      .replace("{name}", member.first_name)
      .replace("{target}", Number(member.monthly_savings_target || 0).toLocaleString())
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Mail className="w-10 h-10 text-blue-600" />
            Send Email
          </h2>
          <p className="text-neutral-600 mt-1">Communicate directly with {member.first_name}</p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <User className="w-4 h-4 mr-2" />
            {member.email || "No email"}
          </Badge>
        </div>
      </div>

      <Card className="p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border-blue-200 shadow-xl">
        <div className="space-y-6">
          {/* To */}
          <div>
            <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              To
            </label>
            <Input value={member.email || "No email address"} disabled className="mt-2 bg-white" />
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Subject
            </label>
            <Input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="mt-2 text-lg"
            />
          </div>

          {/* Quick Templates */}
          <div>
            <p className="text-sm font-semibold text-neutral-700 mb-3">Quick Templates</p>
            <div className="flex flex-wrap gap-3">
              {templates.map(t => (
                <Button
                  key={t.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(t)}
                  className="hover:bg-blue-50"
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <Smile className="w-4 h-4" />
              Message
            </label>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={12}
              className="mt-2 text-base leading-relaxed resize-none"
            />
            <div className="flex justify-between items-center mt-3 text-sm text-neutral-500">
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" disabled><Paperclip className="w-4 h-4 mr-2" />Attach</Button>
                <Button variant="ghost" size="sm" disabled><Smile className="w-4 h-4" />Emoji</Button>
              </div>
              <span>{message.length} characters</span>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline" size="lg">Save as Draft</Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              onClick={() => sendEmail.mutate()}
              disabled={!subject || !message || sendEmail.isPending}
            >
              {sendEmail.isPending ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}