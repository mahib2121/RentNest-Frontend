import { Suspense } from "react";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

/**
 * The navbar's session lookup.
 *
 * `getMe()` reads cookies, which opts the surrounding render into dynamic
 * behaviour. With `cacheComponents` enabled that made the whole public
 * layout dynamic, so every marketing page paid a cookie read and could not
 * be prerendered.
 *
 * `connection()` marks this boundary as dynamic without throwing: the shell
 * around it still prerenders, and only this piece waits for the request.
 */
async function DynamicNavbar() {
  const { connection } = await import("next/server");

  await connection();

  const user = await getMe();

  return <Navbar user={user} />;
}

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense
        fallback={
          <div className="h-14 w-full border-b border-line bg-background/95" />
        }
      >
        <DynamicNavbar />
      </Suspense>

      {children}
    </div>
  );
};

export default PublicLayout;
