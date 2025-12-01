// app/(protected)/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Members</h3>
          <p className="text-3xl font-bold text-orange-600">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Savings</h3>
          <p className="text-3xl font-bold text-green-600">₦45.2M</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Loans</h3>
          <p className="text-3xl font-bold text-blue-600">89</p>
        </div>
      </div>
    </div>
  );
}