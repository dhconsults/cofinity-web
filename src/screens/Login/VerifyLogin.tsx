import React, { useState, useRef, useEffect } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"; 
import { AUTH_API } from "@/constants/api";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { saveData } from "@/lib/storageHelper";

const VerifyLogin: React.FC = () => {
  const navigate = useNavigate();
 
  const {logout, user, tenants, isAuthenticated } = useAuth(); 

 


  const email = user?.email; 


  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
   
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  useEffect(()=> { 
    if(!isAuthenticated){ 

      toast.error("You must be logged in to access this page.");

      navigate('/login')
    }

  }, [isAuthenticated, navigate])

  // Countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "") && index === 5) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
      setTimeout(() => handleVerify(pastedData), 100);
    } else {
      toast.error("Invalid code", {
        description: "Please paste a 6-digit verification code.",
      });
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code.join("");

    if (verificationCode.length !== 6) {
      toast.error("Incomplete code", {
        description: "Please enter all 6 digits.",
      });
      return;
    }

    setIsVerifying(true);

    try {
      await api.post(AUTH_API.VERIFY_LOGIN_CODE, {
        code: verificationCode,
      });

      

      // Trigger user fetch via login (or refetchUser)
      // Since user might not be logged in yet, we'll redirect and let AuthContext handle it

      //check if user has tenant get cooperative

      await saveData('isLoginVerified', true);

      

      console.log("this is tenant", tenants);

     if(tenants != null && tenants.length >  0){

       navigate('/cooperative-selection')

      
    
     }else{ 
      
       navigate('/create-cooperative')

     }
 


      

    //  navigate("/create-cooperative", { replace: true });
    } catch (error: any) {
 
      const message =
        error.response?.data?.message ||
        "Invalid or expired verification code.";

      toast.error("Verification failed", { description: message });

      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);

    try {
      await api.post(AUTH_API.RESEND_LOGIN_CODE);

      toast.success("Code re sent!", {
        description: `New code sent to ${email}`,
      });

      setResendTimer(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error("Failed to resend", {
        description: error.response?.data?.message || "Please try again later.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = async () => {

    await logout()

      toast.success("Logged out successfully!", {
        description: `You have been logged out.`,
      });

      //fake a litle delay 
      await new Promise(resolve => setTimeout(resolve, 1000));



    // navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="w-full max-w-md">
        <Button variant="ghost" className="mb-6 -ml-2" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Logout
        </Button>

        <Card className="border-neutral-100 shadow-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Verify your email
              </CardTitle>
              <CardDescription className="mt-2">
                We've sent a 6-digit verification code to 
                <b> {email} </b> 
              </CardDescription>
            </div>

            {/* Email display/edit */}
           
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-center block">
                Enter verification code
              </Label>
              <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCodeChange(index, e.target.value)
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(index, e)
                    }
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-xl font-semibold"
                    disabled={isVerifying}
                  />
                ))}
              </div>
            </div>

            <Button
              className="w-full bg-black hover:bg-neutral-800 h-12"
              onClick={() => handleVerify()}
              disabled={isVerifying || code.some((d) => d === "")}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Verify Login
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="link"
                className="h-auto p-0 font-semibold"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendTimer > 0 ? (
                  `Resend in ${resendTimer}s`
                ) : (
                  "Resend code"
                )}
              </Button>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
              <p className="text-xs text-neutral-600">
                Tip: You can paste the entire 6-digit code
              </p>
             
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-neutral-500 mt-6">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
};

export default VerifyLogin;
