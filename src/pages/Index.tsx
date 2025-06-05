
const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Applaud</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Residential Living. Never Made Easier.
          </p>
          <div className="space-y-2">
            <a href="/discovery" className="block text-blue-600 hover:underline">
              → Discovery
            </a>
            <a href="/matches" className="block text-blue-600 hover:underline">
              → Matches
            </a>
            <a href="/maintenance" className="block text-blue-600 hover:underline">
              → Maintenance
            </a>
            <a href="/operator" className="block text-blue-600 hover:underline">
              → Operator
            </a>
            <a href="/super-admin" className="block text-blue-600 hover:underline">
              → Super Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
