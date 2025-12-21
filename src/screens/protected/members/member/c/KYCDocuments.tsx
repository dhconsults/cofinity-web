 // src/components/member/KYCDocuments.tsx
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle, Image, FileCheck, Home, PenTool, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";

export default function KYCDocuments({ member }: { member: any }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState<"image" | "pdf">("image");

  // Local state to avoid refresh delay
  const [localMember, setLocalMember] = useState(member);

  useEffect(() => {
    setLocalMember(member);
  }, [member]);

  const documents = [
    { type: "passport_photo", label: "Passport Photo", icon: <Image className="w-6 h-6" />, field: "passport_photo" },
    { type: "id_front", label: "ID Card (Front)", icon: <FileCheck className="w-6 h-6" />, field: "id_front" },
    { type: "id_back", label: "ID Card (Back)", icon: <FileCheck className="w-6 h-6" />, field: "id_back" },
    { type: "proof_of_address", label: "Proof of Address", icon: <Home className="w-6 h-6" />, field: "proof_of_address" },
    { type: "signature", label: "Signature Specimen", icon: <PenTool className="w-6 h-6" />, field: "signature" },
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
      const url = res.data.url;
      const field = vars.type as keyof typeof localMember;

      // Instantly update local state
      setLocalMember(prev => ({ ...prev, [field]: url }));

      toast.success(`${vars.type.replace(/_/g, " ")} uploaded!`);
      setUploading(null);
      setProgress(0);

      // Optional: sync with server
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
    },
    onError: () => {
      toast.error("Upload failed");
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

  const openPreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewType(url.endsWith(".pdf") ? "pdf" : "image");
    setPreviewOpen(true);
  };

  const uploadedCount = documents.filter(d => !!localMember[d.field]).length;

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">KYC Documents</h2>
            <p className="text-neutral-600 mt-1">Identity verification documents</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Completion</p>
            <p className="text-3xl font-bold text-neutral-900">{uploadedCount}/5</p>
            <Progress value={(uploadedCount / 5) * 100} className="w-40 mt-2 h-4" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => {
            const uploaded = !!localMember[doc.field];
            const url = localMember[doc.field];

            return (
              <Card
                key={doc.type}
                className={`p-8 text-center transition-all hover:shadow-2xl relative overflow-hidden ${
                  uploaded ? "border-4 border-emerald-500 bg-emerald-50/30" : "border-2 border-dashed"
                }`}
              >
                {uploaded && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                )}

                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  uploaded ? "bg-emerald-100 text-emerald-600" : "bg-neutral-100 text-neutral-400"
                }`}>
                  {doc.icon}
                </div>

                <h3 className="font-bold text-lg mb-4">{doc.label}</h3>

                {uploaded ? (
                  <div className="space-y-4">
                    <Badge variant="default" className="bg-emerald-600 text-white text-base px-4 py-2">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Uploaded & Verified
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPreview(url)}
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Document
                    </Button>
                  </div>
                ) : (
                  <label htmlFor={`upload-${doc.type}`} className="cursor-pointer block">
                    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 hover:border-neutral-500 transition-all">
                      {uploading === doc.type ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto border-4 border-neutral-400 border-t-emerald-600 rounded-full animate-spin" />
                          <p className="text-sm font-medium">Uploading... {progress}%</p>
                          <Progress value={progress} className="h-3" />
                        </div>
                      ) : (
                        <>
                          <Upload className="w-14 h-14 mx-auto text-neutral-400 mb-4" />
                          <p className="font-medium">Click to upload</p>
                          <p className="text-xs text-neutral-500 mt-1">JPG, PNG, PDF • Max 5MB</p>
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
                )}
              </Card>
            );
          })}
        </div>

        {uploadedCount === 5 && (
          <Card className="p-16 text-center bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300">
            <CheckCircle className="w-24 h-24 text-emerald-600 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-emerald-900">KYC Complete!</h3>
            <p className="text-emerald-700 text-lg mt-3">Member is fully verified and trusted</p>
          </Card>
        )}
      </div>

      {/* Modal Preview */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setPreviewOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>

          <div className="mt-4">
            {previewType === "pdf" ? (
              <iframe
                src={previewUrl}
                className="w-full h-screen min-h-96 rounded-lg border"
                title="PDF Preview"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Document"
                className="w-full h-auto max-h-screen rounded-lg shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

      