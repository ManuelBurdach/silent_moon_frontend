import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userState } from "../../state/userState";

const ProtectRoutes = () => {
  const setUser = userState((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND + import.meta.env.VITE_API_VERSION + "/user/verify",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          setUser(data);
          navigate("/login");
          throw new Error("Authentification faild");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  const nav = useNavigate();
  const user = userState((state) => state.user);

  useEffect(() => {
    if (!user?.isLoggedIn) nav("/");
  });
  return <>{user?.isLoggedIn && <Outlet />}</>;
};

export default ProtectRoutes;
