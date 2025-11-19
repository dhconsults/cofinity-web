import React, { useState } from "react";

const ManageRoles: React.FC = () => {
  const [roles, setRoles] = useState([
    { name: "Super Admin", description: "Full system access" },
    { name: "Loan Officer", description: "Manages loans and payments" },
  ]);

  const [newRole, setNewRole] = useState({ name: "", description: "" });

  const addRole = () => {
    if (!newRole.name) return alert("Enter a role name");
    setRoles([...roles, newRole]);
    setNewRole({ name: "", description: "" });
  };

  return (
    <div className="space-y-4 ">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Manage Roles</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Role Name"
          className="border rounded-md px-3 py-2 text-gray-700"
          value={newRole.name}
          onChange={(e) =>
            setNewRole((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Description"
          className="border rounded-md px-3 py-2 text-gray-700"
          value={newRole.description}
          onChange={(e) =>
            setNewRole((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <button
          onClick={addRole}
          className="sm:col-span-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Add Role
        </button>
      </div>

      <table className="w-full mt-4 border border-gray-200">
        <thead className="bg-gray-50 ">
          <tr>
            <th className="p-2 text-left text-gray-700">Role</th>
            <th className="p-2 text-left text-gray-700">Description</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r, i) => (
            <tr key={i} className="border-t text-black border-gray-100">
              <td className="p-2">{r.name}</td>
              <td className="p-2 text-gray-600">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageRoles;
