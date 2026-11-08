import Image from "next/image";
import { redirect } from "next/navigation";

import { getMe } from "@/service/getMe";

const UserProfilePage = async () => {
  const user = await getMe();

  if (!user?.success) {
    redirect("/login");
  }

  const profile = user.data?.profile;

  return (
    <main className="mx-auto max-w-2xl">
      <div className="mb-8 border-b border-line pb-4">
        <h1 className="font-display text-2xl tracking-tight">
          Profile
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Your account details as landlords and admins see them.
        </p>
      </div>

      <div className="flex items-center gap-4 border border-line bg-card p-5">
        <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-sm bg-secondary">
          {profile?.profile?.profilePhoto ? (
            <Image
              src={profile.profile.profilePhoto}
              alt={profile.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-xl text-muted-foreground">
              {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          )}
        </span>

        <div>
          <p className="font-display text-lg tracking-tight">
            {profile?.name}
          </p>

          <p className="text-sm text-muted-foreground">
            {profile?.email}
          </p>

          <p className="mt-1 text-xs capitalize text-accent-ink">
            {profile?.role?.toLowerCase()}
          </p>
        </div>
      </div>

      {profile?.profile?.bio && (
        <section className="mt-6">
          <h2 className="border-b border-line pb-2 font-display text-lg tracking-tight">
            About
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {profile.profile.bio}
          </p>
        </section>
      )}
    </main>
  );
};

export default UserProfilePage;
