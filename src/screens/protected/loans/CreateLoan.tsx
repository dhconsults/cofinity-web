// src/pages/loans/create.tsx
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateLoanForm from "./CreateLoanForm";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateLoanPage() {
  const navigate = useNavigate();

  return (
    <div className="py-5 lg:p-8   mx-auto">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate("/loans")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Loans
        </Button>
        <h1 className="text-2xl font-bold text-black">Create New Loan Application</h1>
        <p className="text-sm text-gray-600">Fill in the details to apply for a loan</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <CreateLoanForm 
            onSuccess={() => {
              navigate("/loans");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}