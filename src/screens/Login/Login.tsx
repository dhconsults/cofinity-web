import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/Card";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // const onSubmit = async (data: LoginFormData) => {
  //   setIsLoading(true);

  //   try {
  //     // 1. Fetch CSRF cookie (critical for Sanctum)
  //     //  const res =  await fetchCsrfToken();
  //     //  console.log("CSRF token fetched:", res);

  //     // 2. Call your auth context login
  //     await login(data.email, data.password);

  //     // 3. Success
  //     toast.success("Welcome back!", {
  //       description: "Redirecting to your dashboard...",
  //     });

  //     navigate("/verify-login");
  //   } catch (error: any) {
  //     const message =
  //       error.response?.data?.message ||
  //       error.message ||
  //       "Invalid credentials. Please try again.";

  //     toast.error("Login failed", {
  //       description: message,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await login(data.email, data.password);

      // Save email for VerifyLogin page
      localStorage.setItem("verifyEmail", data.email);

      toast.success("Login successful, verify Your login to continue");

      navigate("/verify-login"); // <-- redirect here
    } catch (error: any) {
      toast.error("Login failed", {
        description:
          error.response?.data?.message ||
          error.message ||
          "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google login coming soon!");
  };

  const handleSignup = () => {
    navigate("/signup");
  };
  const [email, setEmail] = useState("");

  const handleVerifyLogin = () => {
    if (!email) return; // prevent redirect if email input is empty

    navigate("/verify-login"); // navigate to next page
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
            <img
              className="w-15 h-auto mb-4"
              src="/images/Cofinitylogo11.png"
              alt=""
            />
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

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-neutral-50 px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img
              className="w-12 h-auto"
              src="/images/Cofinitylogo12.png"
              alt=""
            />
          </div>

          <Card className="border-neutral-100 shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription>
                Sign in to your Cofinity account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="  absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10   h-12 text-base"
                      disabled={isLoading}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 font-normal text-sm"
                    onClick={() => navigate("/forgot-password")}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-black hover:bg-neutral-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
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
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="mr-2 h-4 w-4"
                />
                Continue with Google
              </Button>
            </CardContent>

            <CardFooter className="flex justify-center">
              <p className="text-sm text-neutral-600">
                Don't have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="px-1 font-semibold text-black"
                  onClick={handleSignup}
                  disabled={isLoading}
                >
                  Sign up
                </Button>
              </p>
            </CardFooter>
          </Card>

          <p className="text-center text-xs text-neutral-500 mt-6">
            By signing in, you agree to our{" "}
            <button className="underline hover:text-black">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="underline hover:text-black">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
