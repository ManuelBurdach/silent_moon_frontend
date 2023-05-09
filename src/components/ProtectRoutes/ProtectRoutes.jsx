import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userState } from "../../state/userState";

const ProtectRoutes = () => {
  const nav = useNavigate();
  const user = userState((state) => state.user);

  useEffect(() => {
    if (!user?.isLoggedIn) nav("/");
  });
  return <>{user?.isLoggedIn && <Outlet />}</>;
};

export default ProtectRoutes;
