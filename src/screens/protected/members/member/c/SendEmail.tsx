// src/components/member/SendEmail.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Send, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";

const emailTemplates = [
  {
    name: "Welcome Message",
    subject: "Welcome to {coop_name} Cooperative!",
    body: `Dear {name},

Welcome to the {coop_name} family! We're thrilled to have you join us.

Your membership ID: {membership_id}

Feel free to reach out if you have any questions.

Best regards,
{coop_name} Team`,
  },
  {
    name: "Monthly Savings Reminder",
    subject: "Reminder: Monthly Savings Contribution",
    body: `Hello {name},

This is a gentle reminder that your monthly savings target of ₦{target} is due.

Please make your contribution at your earliest convenience to stay on track.

Thank you for your continued commitment!

Regards,
{coop_name} Team`,
  },
  {
    name: "Loan Approval Notification",
    subject: "Your Loan Application Has Been Approved!",
    body: `Dear {name},

Great news! Your loan application for ₦{amount} has been approved and funds have been disbursed to your account.

Loan Reference: {reference}

Please review your repayment schedule in your member portal.

If you have any questions, feel free to contact us.

Best regards,
{coop_name} Team`,
  },
];

interface SendEmailProps {
  member: {
    id: number;
    first_name: string;
    email?: string;
    monthly_savings_target?: number;
    membership_id?: string;
  };
  cooperativeName?: string; // You can pass this from context or parent
}

export default function SendEmail({
  member,
  cooperativeName = "Your Cooperative",
}: SendEmailProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const message = body;

  const sendEmailMutation = useMutation({
    mutationFn: () =>
      apiClient.post(MEMBERS_API.SENDEMAIL(member.id), {
        subject,
        message,
      }),
    onSuccess: () => {
      toast.success("Email sent successfully");
      setSubject("");
      setBody("");
    },
    onError: (err: any) => {
      toast.error("Failed to send email", { description: err?.message });
    },
  });

  const applyTemplate = (template: (typeof emailTemplates)[0]) => {
    const filledSubject = template.subject
      .replace("{name}", member.first_name)
      .replace("{coop_name}", cooperativeName);

    const filledBody = template.body
      .replace("{name}", member.first_name)
      .replace("{coop_name}", cooperativeName)
      .replace(
        "{target}",
        Number(member.monthly_savings_target || 0).toLocaleString()
      )
      .replace("{membership_id}", member.membership_id || "—")
      .replace("{amount}", "—") // You can enhance this when you have loan context
      .replace("{reference}", "—");

    setSubject(filledSubject);
    setBody(filledBody);
  };

  const characterCount = body.length;
  const isFormValid =
    subject.trim().length > 0 && body.trim().length > 0 && !!member.email;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <Mail className="w-6 h-6 text-muted-foreground" />
            Compose Email
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Send a direct message to {member.first_name}
          </p>
        </div>

        <Badge variant="outline" className="text-sm px-3 py-1">
          <User className="w-3.5 h-3.5 mr-1.5" />
          {member.email || "No email address"}
        </Badge>
      </div>

      <Card className="border shadow-sm">
        <div className="p-6 space-y-6">
          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="to" className="text-sm font-medium">
              To
            </Label>
            <Input
              id="to"
              value={member.email || "No email address on record"}
              disabled
              className="bg-muted/40"
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="text-base"
            />
          </div>

          {/* Quick Templates */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              {emailTemplates.map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(template)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <Label htmlFor="body" className="text-sm font-medium">
              Message
            </Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              rows={12}
              className="resize-none text-base leading-relaxed font-normal"
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1.5">
              <div className="flex items-center gap-4">
                <span>{characterCount} characters</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <div className="flex-1" />

            <Button
              size="lg"
              disabled={!isFormValid || sendEmailMutation.isPending}
              onClick={() => sendEmailMutation.mutate()}
              className="min-w-[180px]"
            >
              {sendEmailMutation.isPending ? (
                <>
                  <FileText className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
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
