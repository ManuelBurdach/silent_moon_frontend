import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    const nav = useNavigate();

    useEffect(() => {
        const login = async () => {
            try {
                const response = await fetch(
                    "http://localhost:10000/spotify/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ code }),
                    }
                );
                const data = await response.json();
                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);
                setExpiresIn(data.expiresIn);
                nav("/musicoverview");
            } catch (error) {
                window.location = "/";
            }
        };
        login();
    }, [code]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        const interval = setInterval(async () => {
            try {
                const response = await fetch(
                    "http://localhost:10000/spotify/refresh",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ refreshToken }),
                    }
                );
                const data = await response.json();
                setAccessToken(data.accessToken);
                setExpiresIn(data.expiresIn);
            } catch (error) {
                window.location = "/music";
            }
        }, (expiresIn - 60) * 1000);
        return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);

    return accessToken;
}
