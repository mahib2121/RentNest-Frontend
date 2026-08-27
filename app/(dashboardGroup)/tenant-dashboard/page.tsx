// import { redirect } from "next/navigation";

// import { getMe } from "@/service/getMe";

// import { getMyRentalRequests } from "../_actions/tenantRequests";
// import RentalRequests from "./_components/RentalRequests";

// export default async function TenantDashboardPage() {
//   const user = await getMe();

//   if (!user?.success) {
//     redirect("/login");
//   }

//   const result = await getMyRentalRequests();

//   return (
//     <main className="mx-auto max-w-6xl p-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Tenant Dashboard</h1>

//         <p className="mt-2 text-gray-600">
//           Manage your rental requests and payments.
//         </p>
//       </div>

//       <RentalRequests requests={result.success ? result.data : []} />

//       {!result.success && <p className="mt-4 text-red-600">{result.message}</p>}
//     </main>
//   );
// }
import { redirect } from "next/navigation";

import { getMe } from "@/service/getMe";
import { getMyRentalRequests } from "../_actions/tenantRequests";
import RentalRequests from "./_components/RentalRequests";



export default async function TenantDashboardPage() {
  const user = await getMe();

  if (!user?.success) {
    redirect("/login");
  }

  const result = await getMyRentalRequests();

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tenant Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Manage your rental requests and payments.
        </p>
      </div>

      <RentalRequests requests={result.success ? result.data : []} />

      {!result.success && <p className="mt-4 text-red-600">{result.message}</p>}
    </main>
  );
}
