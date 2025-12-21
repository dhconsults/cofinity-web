import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Users, Percent, Info } from "lucide-react";

interface DividendDetailModalProps {
  dividend: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPay: () => void;
}

export default function DividendDetailModal({ dividend, open, onOpenChange, onPay }: DividendDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{dividend.title}</DialogTitle>
          <DialogDescription>{dividend.description || "No description"}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Percent className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Rate</p>
                <p className="font-semibold">{(dividend.rate * 100).toFixed(2)}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Declaration Date</p>
                <p className="font-semibold">{new Date(dividend.declaration_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold text-green-600">
                  ₦{parseFloat(dividend.total_amount || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-semibold">{dividend.sharesPlan?.name || "All Active Plans"}</p>
              </div>
            </div>
          </div>

          {dividend.status === "paid" && dividend.payment_date && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <Info className="w-5 h-5" />
                <p className="font-medium">Dividend paid on {new Date(dividend.payment_date).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {dividend.status === "declared" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Info className="w-5 h-5" />
                <p className="font-medium">This dividend is declared and awaiting payment.</p>
              </div>
              <Button
                onClick={onPay}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Pay Dividend Now
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}