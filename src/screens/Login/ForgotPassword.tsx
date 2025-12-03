import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import api from "@/lib/axios";
import { AUTH_API } from "@/constants/api";
import { useNavigate } from "react-router-dom";

const forgetPswSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgetPswSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1); // Back to previous page
    }
  };

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [correctCode] = useState("123456"); // For demo; replace with API.
  const [codeError, setCodeError] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgetPswSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      const response = await api.post(AUTH_API.FORGOT_PASSWORD, {
        email: data.email,
      });

      console.log("Forgot Password Response:", response);

      if (response.status === 200) {
        toast.success("Verification code sent to your email.");
        setEmail(data.email);
        setStep(2);
      } else {
        throw new Error(
          response.data?.message || "Failed to send verification code."
        );
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to process your request. Please try again.";

      toast.error("Password reset failed", {
        description: message,
      });
    }
    setIsLoading(false);
  };

  const handleSendCode = () => {
    if (!email) return;
    setStep(2);
  };

  const handleVerifyCode = () => {
    if (verificationCode === correctCode) {
      setCodeError(false);
      setStep(3);
    } else {
      setCodeError(true);
    }
  };

  const handleChangeCode = (value: string) => {
    setVerificationCode(value);
    if (codeError) setCodeError(false);
  };

  const handleResetPassword = () => {
    if (newPassword && confirm && newPassword === confirm) {
      alert("Password reset successful! Redirect to login.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.02),transparent_50%)]"></div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-12">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-black">C</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Cofinity</h1>
            <div className="w-20 h-1 bg-white rounded-full mb-6"></div>
            <p className="text-xl text-neutral-300 leading-relaxed max-w-md">
              Empowering cooperatives with modern tools for seamless management
              and growth.
            </p>
          </div>

          <div className="space-y-4 mt-12">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white mt-2"></div>
              <p className="text-neutral-400">
                Multi-tenant architecture for complete data isolation
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white mt-2"></div>
              <p className="text-neutral-400">
                Secure payment processing and member management
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white mt-2"></div>
              <p className="text-neutral-400">
                Real-time SMS alerts and notifications
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-neutral-50 px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">C</span>
            </div>
          </div>
          <Card className="w-full max-w-md border-neutral-100 shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Forgot Password
              </CardTitle>
              <CardDescription>
                {step === 1 &&
                  "Enter your email to receive a verification code."}
                {step === 2 && "Enter the code we sent to your email."}
                {step === 3 && "Set your new password."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* STEP 1 — ENTER EMAIL */}
              {step === 1 && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          disabled={isLoading}
                          {...register("email")}
                        />

                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-black hover:bg-neutral-800"
                      onClick={handleSendCode}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Verification Code"}
                    </Button>
                  </div>
                </form>
              )}

              {/* STEP 2 — VERIFY CODE */}
              {step === 2 && (
                <div className="space-y-4">
                  <Label>Verification Code</Label>
                  <Input
                    type="text"
                    placeholder="Enter the 6-digit code"
                    maxLength={6}
                    className={
                      codeError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                    value={verificationCode}
                    onChange={(e) => handleChangeCode(e.target.value)}
                  />

                  {codeError && (
                    <p className="text-sm text-red-500">Incorrect code</p>
                  )}

                  <Button
                    className="w-full bg-black hover:bg-neutral-800"
                    onClick={handleVerifyCode}
                  >
                    Verify Code
                  </Button>
                </div>
              )}

              {/* STEP 3 — NEW PASSWORD */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="pl-10 pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="pl-10 pr-10"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-black hover:bg-neutral-800"
                    onClick={handleResetPassword}
                  >
                    Reset Password & Login
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between text-sm text-neutral-500">
              <Button
                variant="default"
                className="flex items-center gap-2 mb-4 bg-black hover:bg-neutral-800"
                onClick={handleBack}
                disabled={isLoading}
              >
                ← Back
              </Button>

              <span>Cofinity • Secure Recovery</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
