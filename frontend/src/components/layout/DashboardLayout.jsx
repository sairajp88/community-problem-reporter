const DashboardLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
