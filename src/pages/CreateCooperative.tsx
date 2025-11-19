import React, { useState } from "react";
import {
  Upload,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateCooperative: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    regId: "",
    logo: "",
    cac: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (key: string, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => handleChange(key, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email) {
      alert("Please complete all required fields");
      return;
    }

    // Navigate to ChoosePlan page instead of dashboard
    navigate("/choose-plan", { state: { cooperative: form } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-md border border-gray-100">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-gray-700">
            Step {step} of 3
          </span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full ${
                  step >= s ? "bg-black" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Create Cooperative
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          {step === 1 && "Enter your cooperative’s basic info."}
          {step === 2 && "Provide your cooperative’s details."}
          {step === 3 && "Upload required documents."}
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Cooperative Name
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3">
                <Building2 size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full py-2 outline-none text-gray-700"
                  placeholder="e.g. FutureGrow Cooperative"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Cooperative Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3">
                <Mail size={18} className="text-gray-400 mr-2" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full py-2 outline-none text-gray-700"
                  placeholder="you@coop.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Phone</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3">
                <Phone size={18} className="text-gray-400 mr-2" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full py-2 outline-none text-gray-700"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3">
                <MapPin size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full py-2 outline-none text-gray-700"
                  placeholder="e.g. 12 Palm Street, Lagos"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Registration ID
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3">
                <FileText size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={form.regId}
                  onChange={(e) => handleChange("regId", e.target.value)}
                  className="w-full py-2 outline-none text-gray-700"
                  placeholder="e.g. COOP-12345"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Cooperative Logo
              </label>
              <div className="border border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 transition-colors">
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt="Logo"
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                ) : (
                  <>
                    <Upload size={20} className="mb-1" />
                    <span className="text-xs text-gray-500">Upload Logo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logoUpload"
                  onChange={(e) =>
                    handleFileUpload("logo", e.target.files?.[0] || null)
                  }
                />
                <label
                  htmlFor="logoUpload"
                  className="mt-2 text-sm text-indigo-600 cursor-pointer hover:underline"
                >
                  Choose File
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                CAC Certificate
              </label>
              <div className="border border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 transition-colors">
                {form.cac ? (
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-indigo-600" />
                    <span className="text-sm text-gray-700">
                      CAC Certificate Uploaded
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="mb-1" />
                    <span className="text-xs text-gray-500">
                      Upload CAC PDF/Doc
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="cacUpload"
                  onChange={(e) =>
                    handleFileUpload("cac", e.target.files?.[0] || null)
                  }
                />
                <label
                  htmlFor="cacUpload"
                  className="mt-2 text-sm text-indigo-600 cursor-pointer hover:underline"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center text-sm text-gray-600 hover:text-black transition"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-black text-white py-2 px-5 rounded-md hover:bg-gray-800 flex items-center gap-2 transition-colors"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-green-600 text-white py-2 px-5 rounded-md hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 size={18} /> Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCooperative;
