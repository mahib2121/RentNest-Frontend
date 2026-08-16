import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const AuthGroupLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();
  return (
    <div className="max -w">
      <Navbar user={user}></Navbar>
      {children}
    </div>
  );
};

export default AuthGroupLayout;
