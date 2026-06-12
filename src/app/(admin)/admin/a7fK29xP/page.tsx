import AdminTable from "@/components/admin-dashboard/Admin-Table";

const page = () => {
  return (
    <div className="min-h-screen bg-linear-to-r from-[#10395d] from-10% to-[#002140]">
      <AdminTable archived={false} />;
    </div>
  );
};

export default page;
