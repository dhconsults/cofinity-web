// src/components/member/KYCDocuments.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle, XCircle, Image, FileCheck, Home, PenTool } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";

interface KYCDocument {
  type: string;
  label: string;
  field: keyof typeof member;
  icon: React.ReactNode;
  uploaded: boolean;
  url?: string;
}

export default function KYCDocuments({ member }: { member: any }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const documents: KYCDocument[] = [
    { type: "passport_photo", label: "Passport Photo", field: "passport_photo", icon: <Image className="w-6 h-6" />, uploaded: !!member.passport_photo, url: member.passport_photo },
    { type: "id_front", label: "ID Card (Front)", field: "id_front", icon: <FileCheck className="w-6 h-6" />, uploaded: !!member.id_front, url: member.id_front },
    { type: "id_back", label: "ID Card (Back)", field: "id_back", icon: <FileCheck className="w-6 h-6" />, uploaded: !!member.id_back, url: member.id_back },
    { type: "proof_of_address", label: "Proof of Address", field: "proof_of_address", icon: <Home className="w-6 h-6" />, uploaded: !!member.proof_of_address, url: member.proof_of_address },
    { type: "signature", label: "Signature Specimen", field: "signature", icon: <PenTool className="w-6 h-6" />, uploaded: !!member.signature, url: member.signature },
  ];

  const uploadMutation = useMutation({
    mutationFn: async ({ type, file }: { type: string; file: File }) => {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);

      return apiClient.post(MEMBERS_API.KYCUPLOAD(member.id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
    },
    onSuccess: (res, vars) => {
      toast.success(`${vars.type.replace(/_/g, " ")} uploaded successfully!`);
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      setUploading(null);
      setProgress(0);
    },
    onError: () => {
      toast.error("Upload failed. Try again.");
      setUploading(null);
      setProgress(0);
    },
  });

  const handleFileChange = (type: string, file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setUploading(type);
    uploadMutation.mutate({ type, file });
  };

  const uploadedCount = documents.filter(d => d.uploaded).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">KYC Documents</h2>
          <p className="text-neutral-600 mt-1">Identity verification documents</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-600">Completion</p>
          <p className="text-3xl font-bold text-neutral-900">{uploadedCount}/5</p>
          <Progress value={(uploadedCount / 5) * 100} className="w-32 mt-2 h-3" />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <Card
            key={doc.type}
            className={`p-8 text-center transition-all hover:shadow-xl ${
              doc.uploaded ? "border-2 border-emerald-500 bg-emerald-50/50" : "border-dashed border-2"
            }`}
          >
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              doc.uploaded ? "bg-emerald-100 text-emerald-600" : "bg-neutral-100 text-neutral-400"
            }`}>
              {doc.icon}
            </div>

            <h3 className="font-bold text-lg mb-3">{doc.label}</h3>

            {doc.uploaded ? (
              <div className="space-y-4">
                <Badge variant="default" className="bg-emerald-600 text-white">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    View Document
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <label
                  htmlFor={`upload-${doc.type}`}
                  className="cursor-pointer block"
                >
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 hover:border-neutral-400 transition-all">
                    {uploading === doc.type ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto border-4 border-neutral-400 border-t-blue-600 rounded-full animate-spin" />
                        <p className="text-sm text-neutral-600">Uploading... {progress}%</p>
                        <Progress value={progress} className="h-2" />
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
                        <p className="text-sm text-neutral-600">Click to upload</p>
                        <p className="text-xs text-neutral-500 mt-1">JPG, PNG, PDF up to 5MB</p>
                      </>
                    )}
                  </div>
                  <input
                    id={`upload-${doc.type}`}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(doc.type, e.target.files?.[0] || null)}
                    disabled={uploading === doc.type}
                  />
                </label>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary */}
      {uploadedCount === 5 && (
        <Card className="p-12 text-center bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CheckCircle className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-emerald-900">KYC Complete!</h3>
          <p className="text-emerald-700 mt-2">This member is fully verified</p>
        </Card>
      )}
    </div>
  );
}