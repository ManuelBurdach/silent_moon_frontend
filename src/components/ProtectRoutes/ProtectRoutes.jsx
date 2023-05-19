import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userState } from "../../state/userState";

const ProtectRoutes = () => {
    const setUser = userState((state) => state.setUser);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND}${
                        import.meta.env.VITE_API_VERSION
                    }/user/verify`,
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
                    throw new Error("Authentication failed");
                }
            } catch (error) {
                console.error("Error:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [navigate, setUser]);

    const nav = useNavigate();
    const user = userState((state) => state.user);

    /* useEffect(() => {
        if (!user?.isLoggedIn) nav("/login");
    }); */

    if (isLoading) {
        return (
            <div className="lds-ripple">
                <div></div>
                <div></div>
            </div>
        ); // Show a loading indicator while waiting for the user info
    }

    if (isError) {
        return <>An error occurred.</>; // Show an error message if there was a problem with the API request
    }

    return <>{user?.isLoggedIn && <Outlet />}</>;
};

export default ProtectRoutes;
