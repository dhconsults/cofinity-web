import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";

// Predefined message templates
const messageTemplates = [
  {
    label: "Membership Renewal Reminder",
    value:
      "Dear {name}, your membership is due for renewal. Please visit the office or pay online. Thank you!",
  },
  {
    label: "Meeting Invitation",
    value:
      "Hi {name}, join us for the annual cooperative meeting on {date} at {time}. Your presence matters!",
  },
  {
    label: "Payment Confirmation",
    value:
      "Hello {name}, your payment of {amount} has been received. Thank you for your contribution!",
  },
];

interface SendSMSProps {
  memberId: number;
  memberName: string;
  memberPhone: string;
  membershipType?: string;
  status?: string;
}

export default function SendSMS({
  memberId,
  memberName,
  memberPhone,
  membershipType = "Standard",
  status = "Active",
}: SendSMSProps) {
  const [message, setMessage] = useState("");

  const charCount = message.length;
  const smsPages = Math.ceil(charCount / 160);
  const currentPageProgress = ((charCount % 160) / 160) * 100;

  const sendMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(MEMBERS_API.SENDSMS(memberId), {
        message,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("SMS sent successfully!");
      setMessage("");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send SMS. Please try again.");
    },
  });

  const handleTemplateSelect = (value: string) => {
    if (value) {
      const formatted = value.replace("{name}", memberName);
      setMessage(formatted);
    }
  };

  return (
    <div className="  ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Form Card */}
        <Card className="shadow-md">
          <CardHeader className="space-y-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold">
                Send SMS
              </CardTitle>
              <CardDescription className="text-neutral-600">
                Compose and send a message to {memberName}
              </CardDescription>
            </div>

            {/* Member Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold">{memberName}</p>
                <p className="text-sm text-neutral-500">{memberPhone}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{membershipType}</Badge>
                <Badge
                  variant={status === "Active" ? "default" : "destructive"}
                >
                  {status}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Template Picker */}
            <div className="space-y-2">
              <Label htmlFor="template">Message Template</Label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger id="template" className="w-full">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {messageTemplates.map((template) => (
                    <SelectItem key={template.label} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Character Counter */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-neutral-600 gap-1">
                <span>{charCount} / 160 characters</span>
                <span>
                  {smsPages} SMS page{smsPages !== 1 ? "s" : ""}
                </span>
              </div>
              <Progress value={currentPageProgress} className="h-2" />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => sendMutation.mutate()}
              disabled={!message || sendMutation.isPending}
              className="w-full sm:w-auto gap-2"
            >
              <Send className="w-4 h-4" />
              {sendMutation.isPending ? "Sending..." : "Send SMS"}
            </Button>
          </CardFooter>
        </Card>

        {/* Preview Panel (desktop only) */}
        <Card className="shadow-md hidden md:block">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">SMS Preview</CardTitle>
            <CardDescription className="text-neutral-600">
              How the message will appear on the recipient&apos;s phone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-neutral-100 p-4 rounded-lg border border-neutral-200 min-h-50 whitespace-pre-wrap text-sm">
              {message || "Your message preview will appear here..."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
