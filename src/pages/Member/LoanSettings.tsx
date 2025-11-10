import React, { useState } from "react";

const LoanSettings = () => {
  const [settings, setSettings] = useState({
    minAmount: "",
    maxAmount: "",
    interestRate: "",
    maxDuration: "",
    approvalLevels: "",
    penaltyRate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved Settings:", settings);
    alert("Loan settings have been saved successfully!");
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Loan Settings</h1>
      <p className="text-gray-600 mb-6">
        Configure loan parameters such as limits, interest, and approval
        structure.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <label className="block text-sm font-medium mb-2">
            Minimum Loan Amount
          </label>
          <input
            type="number"
            name="minAmount"
            value={settings.minAmount}
            onChange={handleChange}
            placeholder="e.g. 1000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Maximum Loan Amount
          </label>
          <input
            type="number"
            name="maxAmount"
            value={settings.maxAmount}
            onChange={handleChange}
            placeholder="e.g. 100000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Interest Rate (%)
          </label>
          <input
            type="number"
            name="interestRate"
            value={settings.interestRate}
            onChange={handleChange}
            placeholder="e.g. 5"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Max Duration (Months)
          </label>
          <input
            type="number"
            name="maxDuration"
            value={settings.maxDuration}
            onChange={handleChange}
            placeholder="e.g. 24"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Approval Levels
          </label>
          <select
            name="approvalLevels"
            value={settings.approvalLevels}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-400"
          >
            <option value="">Select Level</option>
            <option value="1">Single Approval</option>
            <option value="2">Two-Level Approval</option>
            <option value="3">Three-Level Approval</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Late Payment Penalty (%)
          </label>
          <input
            type="number"
            name="penaltyRate"
            value={settings.penaltyRate}
            onChange={handleChange}
            placeholder="e.g. 2"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default LoanSettings;
