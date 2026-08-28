import { Suspense } from "react";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

// 1. Extract the data fetching into its own async component
async function DynamicNavbar() {
  const user = await getMe();
  return <Navbar user={user} />;
}

// 2. Remove the 'async' keyword from the layout and delete 'force-dynamic'
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max -w">
      {/* 3. Wrap the new component in Suspense */}
      <Suspense
        fallback={<div className="h-16 w-full animate-pulse bg-gray-100" />}
      >
        <DynamicNavbar />
      </Suspense>
      {children}
    </div>
  );
};

export default PublicLayout;
