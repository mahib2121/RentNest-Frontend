import { redirect } from "next/navigation";

import { getMe } from "@/service/getMe";

const UserMyPostsPage = async () => {
  const user = await getMe();

  if (!user?.success) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-4xl">
      <div className="mb-8 border-b border-line pb-4">
        <h1 className="font-display text-2xl tracking-tight">
          My posts
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Questions and announcements you have posted.
        </p>
      </div>

      <div className="border border-line px-6 py-14 text-center">
        <h2 className="font-display text-lg">Nothing posted yet</h2>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Posts you write for other tenants will be listed here.
        </p>
      </div>
    </main>
  );
};

export default UserMyPostsPage;
