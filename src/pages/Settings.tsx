import { ChevronDown, Save } from "lucide-react";
import React, { useState } from "react";

const SectionToggleIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const Settings: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const [settings, setSettings] = useState({
    coopName: "",
    email: "",
    address: "",
    phone: "",
    regId: "",
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
  });

  const handleChange = (key: string, value: any) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = () => {
    // Replace with API call or storing logic
    console.log("Settings saved:", settings);
    alert("Settings saved (console logged).");
  };

  return (
    <div className="p-6 ">
      <div className="flex flex-col sm:flex-row sm:items-center text-gray-700 justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Corporate Admin Settings</h1>
          <p className="text-gray-500">
            Configure your cooperative’s system preferences and access control.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <Save /> Save Changes
          </button>
        </div>
      </div>

      {/* Accordion */}
      <div className="">
        {/* Organization Profile */}
        <div className="bg-white rounded-lg shadow-sm border  ">
          <button
            onClick={() => toggle("profile")}
            className="w-full px-5 py-4 flex items-center justify-between focus:outline-none"
            aria-expanded={openSection === "profile"}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700 text-start">
                Organization Profile
              </h2>
              <p className="text-sm text-gray-500">
                Coop Name, contact and registration details.
              </p>
            </div>
            <SectionToggleIcon open={openSection === "profile"} />
          </button>

          {openSection === "profile" && (
            <div className="px-5 pb-6">
              <form action="" className="grid md:grid-cols-2 gap-4 mt-2">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    Cooperative Name
                  </span>
                  <input
                    className="mt-1 border border-gray-400 text-gray-800 rounded-md px-3 py-2"
                    value={settings.coopName}
                    onChange={(e) => handleChange("coopName", e.target.value)}
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Email</span>
                  <input
                    type="email"
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-800"
                    value={settings.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm text-gray-600">Address</span>
                  <input
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-800"
                    value={settings.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Phone</span>
                  <input
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-800"
                    value={settings.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Registration ID</span>
                  <input
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-800"
                    value={settings.regId}
                    onChange={(e) => handleChange("regId", e.target.value)}
                  />
                </label>
              </form>
            </div>
          )}
        </div>

        {/* Banking & Finance Settings */}
        <div className="bg-white rounded-lg shadow-sm border mt-4">
          <button
            onClick={() => toggle("banking")}
            className="w-full px-5 py-4 flex items-center justify-between focus:outline-none"
            aria-expanded={openSection === "banking"}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700 text-start">
                Banking & Finance Settings
              </h2>
              <p className="text-sm text-gray-500">
                Default account, gateway toggles and fee destination.
              </p>
            </div>
            <SectionToggleIcon open={openSection === "banking"} />
          </button>

          {openSection === "banking" && (
            <div className="px-5 pb-6">
              <form action="" className="grid md:grid-cols-2 gap-4 mt-2">
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm text-gray-600">
                    Default Bank Account
                  </span>
                  <input
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-800"
                    placeholder="Bank name - Account number"
                    value={settings.defaultBank}
                    onChange={(e) =>
                      handleChange("defaultBank", e.target.value)
                    }
                  />
                </label>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.paymentPaystack}
                      onChange={(e) =>
                        handleChange("paymentPaystack", e.target.checked)
                      }
                    />
                    <span className="text-sm text-gray-500">
                      Enable Paystack
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.paymentFlutterwave}
                      onChange={(e) =>
                        handleChange("paymentFlutterwave", e.target.checked)
                      }
                    />
                    <span className="text-sm text-gray-500">
                      Enable Flutterwave
                    </span>
                  </label>
                </div>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm text-gray-600">
                    Fee Destination Account
                  </span>
                  <input
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-800"
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
        </div>

        {/* Registration & Fee Configuration */}
        <div className="bg-white rounded-lg shadow-sm border mt-4">
          <button
            onClick={() => toggle("fees")}
            className="w-full px-5 py-4 flex items-center justify-between focus:outline-none"
            aria-expanded={openSection === "fees"}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700 text-start">
                Registration & Fee Configuration
              </h2>
              <p className="text-sm text-gray-500">
                Registration fee, maintenance, auto-deduct and grace period.
              </p>
            </div>
            <SectionToggleIcon open={openSection === "fees"} />
          </button>

          {openSection === "fees" && (
            <div className="px-5 pb-6">
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    New Member Registration Fee (₦)
                  </span>
                  <input
                    type="number"
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-800"
                    value={settings.regFee}
                    onChange={(e) => handleChange("regFee", e.target.value)}
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    Annual Maintenance Fee (₦)
                  </span>
                  <input
                    type="number"
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-800"
                    value={settings.maintenanceFee}
                    onChange={(e) =>
                      handleChange("maintenanceFee", e.target.value)
                    }
                  />
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.autoDeduct}
                    onChange={(e) =>
                      handleChange("autoDeduct", e.target.checked)
                    }
                  />
                  <span className="text-sm text-gray-700">
                    Auto-Deduct Fee from First Deposit
                  </span>
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    Grace Period (Days)
                  </span>
                  <select
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-800"
                    value={settings.gracePeriod}
                    onChange={(e) =>
                      handleChange("gracePeriod", e.target.value)
                    }
                  >
                    {[7, 14, 21, 30, 45, 60].map((d) => (
                      <option key={d} value={String(d)}>
                        {d} days
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Role & Permission Management */}
        <div className="bg-white rounded-lg shadow-sm border mt-4">
          <button
            onClick={() => toggle("roles")}
            className="w-full px-5 py-4 flex items-center justify-between focus:outline-none"
            aria-expanded={openSection === "roles"}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700 text-start">
                Role & Permission Management
              </h2>
              <p className="text-sm text-gray-500">
                Assign and modify sub-admin roles & permissions.
              </p>
            </div>
            <SectionToggleIcon open={openSection === "roles"} />
          </button>

          {openSection === "roles" && (
            <div className="px-5 pb-6">
              <div className="space-y-3 mt-2">
                <p className="text-sm text-gray-700">
                  Role & permission management.
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-gray-900 hover:bg-black hover:text-gray-400 cursor-pointer rounded">
                    Manage Roles
                  </button>
                  <button className="px-3 py-2 bg-gray-900 hover:bg-black hover:text-gray-400 cursor-pointer rounded">
                    Permission Matrix
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow-sm border mt-4">
          <button
            onClick={() => toggle("notifications")}
            className="w-full px-5 py-4 flex items-center justify-between focus:outline-none"
            aria-expanded={openSection === "notifications"}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700 text-start">
                Notification Preferences
              </h2>
              <p className="text-sm text-gray-500">
                Toggle email / SMS / push alerts.
              </p>
            </div>
            <SectionToggleIcon open={openSection === "notifications"} />
          </button>

          {openSection === "notifications" && (
            <div className="px-5 pb-6 text-gray-700">
              <div className="space-y-2 mt-2">
                {[
                  "Loan Approvals",
                  "KYC Updates",
                  "Savings Alerts",
                  "System Errors",
                  "Member Activities",
                ].map((n) => (
                  <div
                    key={n}
                    className="flex items-center justify-between border-b border-gray-100 py-2"
                  >
                    <span className="text-sm">{n}</span>
                    <input type="checkbox" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Security & System Preferences */}
        <div className="bg-white rounded-lg shadow-sm border mt-4">
          <button
            onClick={() => toggle("security")}
            className="w-full px-5 py-4 flex items-center justify-between focus:outline-none"
            aria-expanded={openSection === "security"}
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700 text-start">
                Security & System Preferences
              </h2>
              <p className="text-sm text-gray-500">
                Password, 2FA, language & date format.
              </p>
            </div>
            <SectionToggleIcon open={openSection === "security"} />
          </button>

          {openSection === "security" && (
            <div className="px-5 pb-6">
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Change Password</span>
                  <input
                    type="password"
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-900"
                    placeholder="New password"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    Confirm Password
                  </span>
                  <input
                    type="password"
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-900"
                    placeholder="Confirm password"
                  />
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm text-gray-700">
                    Enable Two-Factor Authentication (2FA)
                  </span>
                </label>

                <label className="flex flex-col text-gray-500">
                  <span className="text-sm text-gray-600">Language</span>
                  <select
                    className="mt-1 border border-gray-400 rounded-md px-3 py-2"
                    value={settings.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Date Format</span>
                  <select
                    className="mt-1 border rounded-md px-3 py-2 border-gray-400 text-gray-500"
                    value={settings.dateFormat}
                    onChange={(e) => handleChange("dateFormat", e.target.value)}
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  </select>
                </label>

                <div className="md:col-span-2 flex justify-between items-center mt-2">
                  <button className="px-3 py-2 bg-red-50 text-red-700 rounded cursor-pointer">
                    Logout All Devices
                  </button>
                  <div />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
