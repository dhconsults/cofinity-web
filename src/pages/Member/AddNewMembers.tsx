import React, { useState } from "react";

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const steps = ["Personal Info", "Contact Info", "Address Info", "Next of Kin"];

const AddNewMembers = () => {
  const [step, setStep] = useState(0);

  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-4xl rounded-2xl  overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-8 py-6">
            <h1 className="text-2xl font-bold">REGISTRATION FORM</h1>
            <p className="text-gray-300 text-sm">Corporate Organisation</p>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-center items-center gap-6 p-6">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer font-bold text-white ${
                    index <= step ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-16 ${
                      index < step ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="p-8 text-black">
            {step === 0 && (
              <section>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                  PERSONAL INFORMATION
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="First Name" />
                  <Input label="Middle Name" />
                  <Input label="Last Name" />
                  <Input label="Date of Birth" type="date" />
                  <Input label="Place of Birth" />
                  <Select
                    label="Status"
                    options={["Single", "Married", "Divorced", "Other"]}
                  />
                  <Input label="Religion" />
                  <Select
                    label="Employment Status"
                    options={["Employed", "Self-employed", "Unemployed"]}
                  />
                  <Input label="Occupation" />
                  <RadioGroup label="Gender" options={["Male", "Female"]} />
                </div>
              </section>
            )}

            {step === 1 && (
              <section>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                  CONTACT INFORMATION
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Email" type="email" />
                  <Input label="Phone Number" />
                  <Input label="2nd Phone Number" />
                  <Input label="National Identity Number (NIN)" />
                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                  ADDRESS INFORMATION
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Nationality" />
                  <Select label="State" options={nigerianStates} />
                  <Input label="Local Government of Origin" />
                  <Input label="Full Address" />
                </div>
              </section>
            )}

            {step === 3 && (
              <section>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                  NEXT OF KIN DETAILS
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="First Name" />
                  <Input label="Middle Name" />
                  <Input label="Last Name" />
                  <Input label="Date of Birth" type="date" />
                  <Input label="Full Address" />
                  <Select
                    label="Status"
                    options={["Single", "Married", "Divorced", "Other"]}
                  />
                  <Input label="Local Government of Origin" />
                  <Input label="Religion" />
                  <Input label="Email" type="email" />
                  <Input label="Phone Number" />
                  <Input label="2nd Phone Number" />
                  <RadioGroup label="Gender" options={["Male", "Female"]} />
                </div>
              </section>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
              <button
                onClick={prevStep}
                disabled={step === 0}
                className={`px-6 py-2 rounded-md border ${
                  step === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                Previous
              </button>

              {step < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, type = "text" }: { label: string; type?: string }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
    />
  </div>
);

const Select = ({ label, options }: { label: string; options: string[] }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:outline-none">
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const RadioGroup = ({
  label,
  options,
}: {
  label: string;
  options: string[];
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="flex gap-4">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={label.toLowerCase()} />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export default AddNewMembers;
