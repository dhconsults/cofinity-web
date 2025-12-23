import React, { useState } from "react";

interface LoanFormData {
  fullName: string;
  email: string;
  phone: string;
  membershipId: string;
  loanAmount: string;
  loanPurpose: string;
  repaymentPeriod: string;
  incomeProof: File | null;
}

export default function LoanApplicationForm() {
  const [formData, setFormData] = useState<LoanFormData>({
    fullName: "",
    email: "",
    phone: "",
    membershipId: "",
    loanAmount: "",
    loanPurpose: "",
    repaymentPeriod: "",
    incomeProof: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, incomeProof: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Your loan application has been submitted successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white shadow-xl rounded-2xl p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-black text-center">
          Cooperative Loan Application
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Membership ID
            </label>
            <input
              type="text"
              name="membershipId"
              value={formData.membershipId}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loan Amount (₦)
            </label>
            <input
              type="text"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Repayment Period
            </label>
            <select
              name="repaymentPeriod"
              value={formData.repaymentPeriod}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-black focus:outline-none"
            >
              <option
                value=""
                className="text-sm font-medium text-gray-700 bg-gray-300"
              >
                Select...
              </option>
              <option
                value="6 months"
                className="text-sm font-medium text-gray-700"
              >
                6 Months
              </option>
              <option
                value="12 months"
                className="text-sm font-medium text-gray-700"
              >
                12 Months
              </option>
              <option
                value="18 months"
                className="text-sm font-medium text-gray-700"
              >
                18 Months
              </option>
              <option
                value="24 months"
                className="text-sm font-medium text-gray-700"
              >
                24 Months
              </option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loan Purpose
          </label>
          <textarea
            name="loanPurpose"
            value={formData.loanPurpose}
            onChange={handleChange}
            rows={3}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Income Proof
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange}
            className="mt-1 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}
