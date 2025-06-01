import { redirect } from "next/navigation";

function AdminPage() {
  return redirect("/admin/dashboard");
}

export default AdminPage;
