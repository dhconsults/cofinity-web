import React, { useState } from "react";
import { Save, Settings as SettingsIcon, Upload } from "lucide-react";
import ManageRoles from "./ManageRoles";
import PermissionMatrix from "./PermissionMatrix";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("organization");
  const [roleView, setRoleView] = useState<"manage" | "matrix">("manage");
  const [settings, setSettings] = useState({
    coopName: "",
    email: "",
    address: "",
    phone: "",
    regId: "",
    profilePhoto: "",
    cacCertificate: "",
    defaultBank: "",
    paymentPaystack: false,
    paymentFlutterwave: false,
    feeDestination: "",
    regFee: "",
    maintenanceFee: "",
    autoDeduct: false,
    gracePeriod: "7",
    welcomeMsg: "",
    language: "en",
    dateFormat: "dd/mm/yyyy",
    brandColor: "#4f46e5",
    logo: "",
    font: "Inter",
    fontSize: "16",
  });

  const handleChange = (key: string, value: any) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => handleChange(key, reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Settings saved:", settings);
    alert("Settings saved successfully! (check console)");
  };

  const tabs = [
    { key: "organization", label: "Organization Profile" },
    { key: "banking", label: "Banking & Finance" },
    { key: "fees", label: "Registration & Fees" },
    { key: "roles", label: "Roles & Permissions" },
    { key: "notifications", label: "Notifications" },
    { key: "security", label: "Security" },
    { key: "theme", label: "Theme & Customization" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="md:w-64 w-full bg-white border-b md:border-b-0 md:border-r shadow-sm">
        <div className="flex items-center justify-between md:justify-start gap-2 px-5 py-4 border-b md:border-none">
          <div className="flex items-center gap-2">
            <SettingsIcon className="text-gray-800" />
            <h2 className="font-semibold text-gray-800  text-sm md:text-base">
              Settings
            </h2>
          </div>
        </div>

        {/* Tabs Navigation */}
        <nav className="flex overflow-x-auto md:overflow-visible border-b md:border-none">
          <div className="flex md:flex-col w-max md:w-full">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm text-left whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "bg-gray-100 border-l-4 border-gray-600 text-gray-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Desktop Save Button */}
        <div className="hidden md:block mt-auto px-5 py-4 border-t">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-4 overflow-y-auto space-y-10">
        {/* Organization Profile */}
        {activeTab === "organization" && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Organization Profile
            </h1>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Cooperative Name</span>
                <input
                  type="text"
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  placeholder="Enter name"
                  value={settings.coopName}
                  onChange={(e) => handleChange("coopName", e.target.value)}
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Email</span>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </label>

              <label className="flex flex-col sm:col-span-2">
                <span className="text-sm text-gray-700">Address</span>
                <input
                  type="text"
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  value={settings.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Phone</span>
                <input
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Registration ID</span>
                <input
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  value={settings.regId}
                  onChange={(e) => handleChange("regId", e.target.value)}
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">
                  Upload Profile Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 bg-black text-gray-50 rounded-md p-2 cursor-pointer w-full"
                  onChange={(e) => handleFileUpload(e, "profilePhoto")}
                />
                {settings.profilePhoto && (
                  <img
                    src={settings.profilePhoto}
                    alt="Profile Preview"
                    className="mt-3 w-28 h-28 object-contain border rounded"
                  />
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">
                  Upload CAC Certificate
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="mt-1 bg-black text-gray-50 rounded-md p-2 cursor-pointer w-full"
                  onChange={(e) => handleFileUpload(e, "cacCertificate")}
                />
                {settings.cacCertificate && (
                  <div className="mt-3 flex items-center gap-2 text-gray-700">
                    <Upload size={16} />
                    <span>Certificate uploaded</span>
                  </div>
                )}
              </label>
            </form>
          </div>
        )}

        {/* Banking & Finance */}
        {activeTab === "banking" && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Banking & Finance Settings
            </h1>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="flex flex-col sm:col-span-2">
                <span className="text-sm text-gray-700">
                  Default Bank Account
                </span>
                <input
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  placeholder="Bank name - Account number"
                  value={settings.defaultBank}
                  onChange={(e) => handleChange("defaultBank", e.target.value)}
                />
              </label>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={settings.paymentPaystack}
                    onChange={(e) =>
                      handleChange("paymentPaystack", e.target.checked)
                    }
                  />
                  <span>Enable Paystack</span>
                </label>

                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={settings.paymentFlutterwave}
                    onChange={(e) =>
                      handleChange("paymentFlutterwave", e.target.checked)
                    }
                  />
                  <span>Enable Flutterwave</span>
                </label>
              </div>

              <label className="flex flex-col sm:col-span-2">
                <span className="text-sm text-gray-700">
                  Fee Destination Account
                </span>
                <input
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  placeholder="Account to receive fees"
                  value={settings.feeDestination}
                  onChange={(e) =>
                    handleChange("feeDestination", e.target.value)
                  }
                />
              </label>
            </form>
          </div>
        )}

        {/* Registration & Fees */}
        {activeTab === "fees" && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Registration & Fee Configuration
            </h1>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">
                  Registration Fee (₦)
                </span>
                <input
                  type="number"
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  value={settings.regFee}
                  onChange={(e) => handleChange("regFee", e.target.value)}
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">
                  Maintenance Fee (₦)
                </span>
                <input
                  type="number"
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  value={settings.maintenanceFee}
                  onChange={(e) =>
                    handleChange("maintenanceFee", e.target.value)
                  }
                />
              </label>

              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={settings.autoDeduct}
                  onChange={(e) => handleChange("autoDeduct", e.target.checked)}
                />
                <span className="text-sm text-gray-700">
                  Auto-Deduct from First Deposit
                </span>
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Grace Period</span>
                <select
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2 w-full"
                  value={settings.gracePeriod}
                  onChange={(e) => handleChange("gracePeriod", e.target.value)}
                >
                  {[7, 14, 21, 30, 45, 60].map((d) => (
                    <option key={d} value={String(d)}>
                      {d} days
                    </option>
                  ))}
                </select>
              </label>
            </form>
          </div>
        )}

        {/* Roles & Permissions */}
        {activeTab === "roles" && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Roles & Permissions
            </h1>
            <p className="text-gray-700 mb-4">
              Manage sub-admin access levels and responsibilities.
            </p>

            {/* Sub-Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setRoleView("manage")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  roleView === "manage"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Manage Roles
              </button>
              <button
                onClick={() => setRoleView("matrix")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  roleView === "matrix"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Permission Matrix
              </button>
            </div>

            {/* Render Sub-Page */}
            {roleView === "manage" ? <ManageRoles /> : <PermissionMatrix />}
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Notification Preferences
            </h1>
            <div className="space-y-3">
              {[
                "Loan Approvals",
                "KYC Updates",
                "Savings Alerts",
                "System Errors",
                "Member Activities",
              ].map((n) => (
                <label
                  key={n}
                  className="flex items-center justify-between border-b py-2 text-gray-700"
                >
                  <span>{n}</span>
                  <input type="checkbox" />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Security Settings
            </h1>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Change Password</span>
                <input
                  type="password"
                  placeholder="New Password"
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Confirm Password</span>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2"
                />
              </label>

              <label className="flex items-center gap-2 md:col-span-2">
                <input type="checkbox" />
                <span className="text-sm text-gray-700">
                  Enable Two-Factor Authentication (2FA)
                </span>
              </label>
              <button className="bg-black rounded-md p-3 w-50 cursor-pointer hover:bg-gray-800 transition-colors">
                Reset Password
              </button>
            </div>
          </div>
        )}

        {/* Theme & Customization */}
        {activeTab === "theme" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Theme & Customization
            </h1>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 bg-black rounded-md p-2 w-50 cursor-pointer hover:bg-gray-800 transition-colors"
                  onChange={(e) => handleFileUpload(e, "logo")}
                />
                {settings.logo && (
                  <img
                    src={settings.logo}
                    alt="Logo Preview"
                    className="mt-3 w-32 h-32 object-contain border rounded"
                  />
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Brand Color</span>
                <input
                  type="color"
                  value={settings.brandColor}
                  onChange={(e) => handleChange("brandColor", e.target.value)}
                  className="w-20 h-10 mt-1 border rounded"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Font Family</span>
                <select
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2"
                  value={settings.font}
                  onChange={(e) => handleChange("font", e.target.value)}
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Open Sans">Open Sans</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-700">Font Size</span>
                <input
                  type="number"
                  className="mt-1 border border-gray-300 text-gray-700 rounded-md px-3 py-2"
                  value={settings.fontSize}
                  onChange={(e) => handleChange("fontSize", e.target.value)}
                  min="12"
                  max="24"
                />
              </label>
            </div>
          </div>
        )}
      </main>

      {/* Floating Save Button for Mobile */}
      <button
        onClick={handleSave}
        className="md:hidden fixed bottom-4 right-4 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800"
      >
        <Save size={20} />
      </button>
    </div>
  );
};

export default Settings;
