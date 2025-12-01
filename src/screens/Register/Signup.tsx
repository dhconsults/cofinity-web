import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import  { fetchCsrfToken } from "@/lib/sanctum";
import { AUTH_API } from "@/constants";
import api from "@/lib/axios";
import { useSignupFlowStore } from "@/stores/useSignupFlowStore";

// Zod schema
const signupSchema = z.object({
   email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;



const Signup: React.FC = () => {

  const { setEmail } = useSignupFlowStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");

  // Password strength indicator (your original logic — untouched)
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { strength: 50, label: "Fair", color: "bg-orange-500" };
    if (password.length < 12) return { strength: 75, label: "Good", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      // 1. Get CSRF cookie
      await fetchCsrfToken();

      // 2. Send signup request
  await api.post(AUTH_API.REGISTER, {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
    });
      // 3. Success
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account.",
        duration: 6000,
      });


      setEmail(data.email);

      navigate("/verify-email");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        "Something went wrong. Please try again.";

      toast.error("Signup failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.info("Google signup coming soon!");
    // navigate("/create-cooperative");
  };

  const handleLogin = () => {
    navigate("/login");
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
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              Join Cofinity
            </h1>
            <div className="w-20 h-1 bg-white rounded-full mb-6"></div>
            <p className="text-xl text-neutral-300 leading-relaxed max-w-md">
              Start managing your cooperative with powerful tools designed for growth and efficiency.
            </p>
          </div>

          <div className="space-y-5 mt-12">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Complete Member Management</p>
                <p className="text-neutral-400 text-sm">Track, verify, and manage all cooperative members</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Secure Transactions</p>
                <p className="text-neutral-400 text-sm">Process payments and withdrawals with confidence</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Real-time Alerts</p>
                <p className="text-neutral-400 text-sm">Keep members informed via SMS and email</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-neutral-50 px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">C</span>
            </div>
          </div>

          <Card className="border-neutral-100 shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Create your account
              </CardTitle>
              <CardDescription>
                Get started with Cofinity in just a few steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="Enter your first name"
                      className="pl-10 h-12 text-base"
                      disabled={isLoading}
                      {...register("first_name")}
                    />
                    {errors.first_name && (
                      <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Enter your last name"
                      className="pl-10 h-12 text-base"
                      disabled={isLoading}
                      {...register("last_name")}
                    />
                    {errors.last_name && (
                      <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="pl-10 h-12 text-base"
                      disabled={isLoading}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-12 text-base"
                      disabled={isLoading}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 h-12 text-base"
                      disabled={isLoading}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength.strength >= 25 ? passwordStrength.color : 'bg-neutral-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength.strength >= 50 ? passwordStrength.color : 'bg-neutral-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength.strength >= 75 ? passwordStrength.color : 'bg-neutral-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength.strength >= 100 ? passwordStrength.color : 'bg-neutral-200'}`}></div>
                      </div>
                      {passwordStrength.label && (
                        <p className="text-xs text-neutral-500">
                          Password strength: <span className="font-medium">{passwordStrength.label}</span>
                        </p>
                      )}
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className="pl-10 h-12 text-base"
                      disabled={isLoading}
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-neutral-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="mr-2 h-5 w-5"
                />
                Sign up with Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="px-1 font-semibold text-black"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  Sign in
                </Button>
              </p>
            </CardFooter>
          </Card>

          <p className="text-center text-xs text-neutral-500 mt-6">
            By creating an account, you agree to our{" "}
            <button className="underline hover:text-black">Terms of Service</button>
            {" "}and{" "}
            <button className="underline hover:text-black">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;