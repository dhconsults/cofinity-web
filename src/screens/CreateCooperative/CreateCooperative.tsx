// src/pages/CreateCooperative.tsx
"use client";

import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { TENANT_API } from "@/constants";
import api from "@/lib/axios";

// Form Schema
const formSchema = z.object({
  name: z.string().min(3, "Cooperative name is required"),
  initials: z.string().max(10, "Initials too long").optional(),
  registration_number: z.string().min(3, "Registration number required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().min(20, "Tell us about your cooperative").max(500),
  industry_type: z.string().min(1, "Select industry"),
  business_type: z.string().min(1, "Select business type"),
  founded_at: z.date().refine((date) => date !== null, "Founding date required"),
  address: z.string().min(10, "Full address required"),
  city: z.string().min(2),
  state: z.string().min(2),
  lga: z.string().min(2, "LGA required"),
  country: z.string().min(2),
  bank_name: z.string().min(2, "Bank name required"),
  account_name: z.string().min(3),
  account_number: z.string().min(10).max(12),
  logo: z.any().optional(),
  cac_document: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { number: 1, title: "Basic Info" },
  { number: 2, title: "Location & Details" },
  { number: 3, title: "Bank & Documents" },
];

export default function CreateCooperative() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [cacPreview, setCacPreview] = useState<string | null>(null);

  
  
  
  

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      initials: "",
      registration_number: "",
      email: "",
      phone: "",
      website: "",
      description: "",
      industry_type: "",
      business_type: "",
      address: "",
      city: "",
      state: "",
      lga: "",
      country: "Nigeria",
      bank_name: "",
      account_name: "",
      account_number: "",
    },
  });

  const progress = (currentStep / steps.length) * 100;

  const handleFile = (field: "logo" | "cac_document", file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === "logo") {
        setLogoPreview(reader.result as string);
        form.setValue("logo", file);
      } else {
        setCacPreview(reader.result as string);
        form.setValue("cac_document", file);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormValues) => {
     
   

    const formData = new FormData();

  // Append all text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, value.toISOString().split('T')[0]);
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  }); 


  try {
      const response = api.post(TENANT_API.CREATE_TENANT, data); 

    console.log(response)
     

     

   

    toast.success("Cooperative created! Now choose your plan");

    // Redirect with tenant info
    // navigate("/choose-plan", {
    //   state: { tenant },
    // });
  } catch (error) {
    toast.error("Failed to save cooperative. Please try again.");
    console.error(error);
  }






   
    // Pass data to next step
    // navigate("/choose-plan", {
    //   state: { cooperative: data, logoPreview, cacPreview },
    // });


  };

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ["name", "initials", "registration_number", "email", "phone", "description", "industry_type", "business_type", "founded_at"],
      2: ["address", "city", "state", "lga", "country", "website"],
      3: ["bank_name", "account_name", "account_number"],
    }[currentStep];

    const result = await form.trigger(fieldsToValidate as any);
    if (result && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  return (
    <>
      <div className="min-h-screen  bg-neutral-50  flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-sm border-0">
          <CardHeader className="text-center pb-8">
            <Badge className="mx-auto mb-3 w-fit" variant="secondary">
              Step {currentStep} of {steps.length}
            </Badge>
            <CardTitle className="text-3xl font-bold">Create Your Cooperative</CardTitle>
            <CardDescription className="text-base mt-2">
              {steps[currentStep - 1].title}
            </CardDescription>
            <Progress value={progress} className="mt-6 h-2" />
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooperative Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="FutureGrow Cooperative" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="initials" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initials (e.g. FGC)</FormLabel>
                          <FormControl>
                            <Input placeholder="FGC" className="uppercase" {...field} />
                          </FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="registration_number" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="RC1234567 or COOP-2024-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="admin@futuregrow.coop" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+234 800 000 0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="We are a savings and credit cooperative empowering farmers in Northern Nigeria..."
                            className="resize-none h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
                      <FormField control={form.control} name="industry_type" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="agriculture">Agriculture</SelectItem>
                              <SelectItem value="transport">Transport</SelectItem>
                              <SelectItem value="traders">Traders & Artisans</SelectItem>
                              <SelectItem value="housing">Housing</SelectItem>
                              <SelectItem value="multipurpose">Multi-purpose</SelectItem>
                              <SelectItem value="others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField   control={form.control} name="business_type" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="savings-credit">Savings & Credit</SelectItem>
                              <SelectItem value="consumer">Consumer</SelectItem>
                              <SelectItem value="producer">Producer</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="founded_at" render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Founded Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="12 Palm Avenue, Ikeja" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Lagos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <FormControl>
                            <Input placeholder="Lagos State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="lga" render={({ field }) => (
                        <FormItem>
                          <FormLabel>LGA *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ikeja" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input defaultValue="Nigeria" {...field} />
                          </FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="website" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://futuregrow.coop" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                      <Label className="text-base font-semibold">Cooperative Logo</Label>
                      <div className="mt-3">
                        {logoPreview ? (
                          <div className="flex items-center gap-4">
                            <img src={logoPreview} alt="Logo" className="w-24 h-24 rounded-xl object-cover border-2" />
                            <Button type="button" variant="outline" onClick={() => { setLogoPreview(null); form.setValue("logo", null); }}>
                              Change
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">Click to upload logo</span>
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFile("logo", e.target.files?.[0] || null)}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-semibold text-lg">Bank Account Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name="bank_name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="GTBank" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="account_name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="FutureGrow Cooperative" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="account_number" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="0123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">CAC Certificate</Label>
                      <div className="mt-3">
                        {cacPreview ? (
                          <div className="flex items-center gap-3 text-sm">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>CAC Document uploaded</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => { setCacPreview(null); form.setValue("cac_document", null); }}>
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm">Upload CAC Certificate (PDF)</span>
                            <Input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => handleFile("cac_document", e.target.files?.[0] || null)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-8 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={cn(currentStep === 1 && "invisible")}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {currentStep < 3 ? (
                    <Button type="button" onClick={nextStep} size="lg">
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Create Cooperative
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// export default CreateCooperative;
