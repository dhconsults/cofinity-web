import React, { useState } from "react";

interface Permission {
  role: string;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

const defaultPermissions: Permission[] = [
  { role: "Super Admin", view: true, edit: true, delete: true },
  { role: "Loan Officer", view: true, edit: true, delete: false },
];

const PermissionMatrix: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>(
    () => defaultPermissions
  );
  const [newRoleName, setNewRoleName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // fields we allow toggling (role is excluded intentionally)
  const fields: Array<keyof Omit<Permission, "role">> = [
    "view",
    "edit",
    "delete",
  ];

  const togglePermission = (index: number, field: keyof Permission) => {
    if (field === "role") return; // safety
    setPermissions((prev) => {
      const copy = prev.map((p) => ({ ...p }));
      copy[index][field] = !copy[index][field];
      return copy;
    });
  };

  const toggleAllForField = (field: keyof Omit<Permission, "role">) => {
    // determine if all are true already, then invert accordingly
    const allTrue = permissions.every((p) => p[field]);
    setPermissions((prev) => prev.map((p) => ({ ...p, [field]: !allTrue })));
  };

  const addRole = () => {
    const trimmed = newRoleName.trim();
    if (!trimmed) {
      alert("Enter a role name.");
      return;
    }
    // prevent duplicate role names
    if (
      permissions.some((p) => p.role.toLowerCase() === trimmed.toLowerCase())
    ) {
      alert("A role with that name already exists.");
      return;
    }
    setPermissions((prev) => [
      ...prev,
      { role: trimmed, view: false, edit: false, delete: false },
    ]);
    setNewRoleName("");
    setShowAdd(false);
  };

  const removeRole = (index: number) => {
    if (!confirm(`Remove role "${permissions[index].role}"?`)) return;
    setPermissions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Replace with API call
    console.log("Permissions to save:", permissions);
    alert("Permissions saved (check console).");
  };

  const roleSummary = (p: Permission) => {
    const granted = ["view", "edit", "delete"].filter((f) =>
      Boolean(p[f as keyof Permission])
    );
    return `${granted.length} granted`;
  };

  return (
    <div className="rounded-lg bg-white border shadow-sm p-4">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Permission Matrix
          </h3>
          <p className="text-sm text-gray-500">
            Toggle access for roles. Click column headers to toggle all.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
          >
            + Add Role
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-4 flex gap-2 items-center">
          <input
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder="New role name (e.g. KYC Manager)"
          />
          <button
            onClick={addRole}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAdd(false);
              setNewRoleName("");
            }}
            className="px-3 py-2 border rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-700">
              <th className="py-3 px-4 text-left font-medium">Role</th>

              {fields.map((f) => (
                <th
                  key={f}
                  className="py-3 px-6 text-center font-medium cursor-pointer select-none"
                  onClick={() => toggleAllForField(f)}
                  title={`Toggle all ${f}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="capitalize">{f}</span>
                    <button
                      className="text-xs px-2 py-[2px] border rounded text-gray-500 hover:bg-gray-100"
                      onClick={(e) => {
                        // prevent header button from triggering row click double event
                        e.stopPropagation();
                        toggleAllForField(f);
                      }}
                    >
                      All
                    </button>
                  </div>
                </th>
              ))}

              <th className="py-3 px-4 text-center font-medium">Summary</th>
              <th className="py-3 px-4 text-center font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {permissions.map((perm, idx) => (
              <tr
                key={perm.role}
                className="border-t last:border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-800">
                  {perm.role}
                </td>

                {fields.map((f) => (
                  <td key={f} className="py-3 px-6 text-center">
                    <input
                      type="checkbox"
                      checked={Boolean(perm[f])}
                      onChange={() =>
                        togglePermission(idx, f as keyof Permission)
                      }
                      className="accent-black w-4 h-4"
                      aria-label={`${perm.role} ${f}`}
                    />
                  </td>
                ))}

                <td className="py-3 px-4 text-sm text-gray-600 text-center">
                  <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-xs">
                    {roleSummary(perm)}
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => removeRole(idx)}
                    className="text-red-600 text-sm hover:underline"
                    title={`Remove ${perm.role}`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {permissions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  No roles defined yet — add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionMatrix;
