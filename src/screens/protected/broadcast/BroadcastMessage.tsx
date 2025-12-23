// src/pages/BroadcastMessage.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Send,
  Mail,
  MessageSquare,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

// Zod schema
const emailSchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  sendToAll: z.boolean(),
});

const smsSchema = z.object({
  message: z
    .string()
    .min(10, "SMS must be at least 10 characters")
    .max(160, "SMS limited to 160 characters"),
  sendToAll: z.boolean(),
});

type EmailForm = z.infer<typeof emailSchema>;
type SmsForm = z.infer<typeof smsSchema>;

export default function BroadcastMessage() {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email form
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: "",
      message: "",
      sendToAll: true,
    },
  });

  // SMS form
  const smsForm = useForm<SmsForm>({
    resolver: zodResolver(smsSchema),
    defaultValues: {
      message: "",
      sendToAll: true,
    },
  });

  const onSubmitEmail = async (data: EmailForm) => {
    setIsSubmitting(true);
    try {
      await apiClient.post("/api/broadcast/email", data);
      toast.success("Email broadcast queued successfully");
      emailForm.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send email broadcast"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitSms = async (data: SmsForm) => {
    setIsSubmitting(true);
    try {
      await apiClient.post("/api/broadcast/sms", data);
      toast.success("SMS broadcast queued successfully");
      smsForm.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send SMS broadcast"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = smsForm.watch("message").length;

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Send className="w-8 h-8" />
            Broadcast Message
          </h1>
          <p className="text-gray-600 mt-2">
            Send important announcements to all or selected members via email or
            SMS.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Choose Channel</CardTitle>
            <CardDescription>
              Select email or SMS to compose your broadcast message.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "email" | "sms")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="sms">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-6 space-y-6">
                <form
                  onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                  className="space-y-5"
                >
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <input
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter email subject"
                      {...emailForm.register("subject")}
                    />
                    {emailForm.formState.errors.subject && (
                      <p className="text-sm text-red-600 mt-1">
                        {emailForm.formState.errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email-message">Message</Label>
                    <Textarea
                      id="email-message"
                      rows={8}
                      placeholder="Write your email message here..."
                      className="resize-none"
                      {...emailForm.register("message")}
                    />
                    {emailForm.formState.errors.message && (
                      <p className="text-sm text-red-600 mt-1">
                        {emailForm.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-all"
                      checked={emailForm.watch("sendToAll")}
                      onCheckedChange={(checked) =>
                        emailForm.setValue("sendToAll", !!checked)
                      }
                    />
                    <label
                      htmlFor="email-all"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Send to all active members (
                      {/* Replace with actual count later */}124 members)
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email Broadcast
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="sms" className="mt-6 space-y-6">
                <form
                  onSubmit={smsForm.handleSubmit(onSubmitSms)}
                  className="space-y-5"
                >
                  <div>
                    <Label htmlFor="sms-message">SMS Message</Label>
                    <Textarea
                      id="sms-message"
                      rows={6}
                      placeholder="Write your SMS here (max 160 characters)..."
                      className="resize-none"
                      {...smsForm.register("message")}
                    />
                    <div className="flex justify-between items-center mt-2">
                      {smsForm.formState.errors.message && (
                        <p className="text-sm text-red-600">
                          {smsForm.formState.errors.message.message}
                        </p>
                      )}
                      <p
                        className={`text-sm ${
                          characterCount > 160
                            ? "text-red-600"
                            : "text-gray-500"
                        } ml-auto`}
                      >
                        {characterCount}/160
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms-all"
                      checked={smsForm.watch("sendToAll")}
                      onCheckedChange={(checked) =>
                        smsForm.setValue("sendToAll", !!checked)
                      }
                    />
                    <label
                      htmlFor="sms-all"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Send to all active members with phone numbers
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || characterCount > 160}
                    >
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send SMS Broadcast
                    </Button>
                    {characterCount > 160 && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Message exceeds 160 characters
                      </div>
                    )}
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Users className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Note:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Broadcasts are queued and sent asynchronously.</li>
                  <li>
                    Only members with verified email/phone will receive
                    messages.
                  </li>
                  <li>
                    Ensure SMS/Email alerts are enabled in cooperative settings.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
