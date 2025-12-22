import React, { useState } from "react";
import { Save, X, Calendar, DollarSign, Users } from "lucide-react";

const AddNewSharePlan = () => {
  const [formData, setFormData] = useState({
    planName: "",
    planType: "",
    totalShares: "",
    sharePrice: "",
    startDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Share Plan:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Add New Share Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Plan Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              placeholder="e.g. Employee Growth Plan"
              className="w-full border border-gray-500 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
              required
            />
          </div>

          {/* Plan Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Plan Type
            </label>
            <select
              name="planType"
              value={formData.planType}
              onChange={handleChange}
              className="w-full border border-gray-500 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
              required
            >
              <option value="">Select Type</option>
              <option value="employee">Employee Share Plan</option>
              <option value="investor">Investor Plan</option>
              <option value="public">Public Offer</option>
            </select>
          </div>

          {/* Total Shares */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Total Shares
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              <input
                type="number"
                name="totalShares"
                value={formData.totalShares}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full border border-gray-500 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                required
              />
            </div>
          </div>

          {/* Share Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Share Price ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              <input
                type="number"
                step="0.01"
                name="sharePrice"
                value={formData.sharePrice}
                onChange={handleChange}
                placeholder="e.g. 25.50"
                className="w-full border border-gray-500 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                required
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-gray-500 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              className="flex items-center gap-2 bg-black text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-700 transition "
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition "
            >
              <Save size={18} />
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewSharePlan;
