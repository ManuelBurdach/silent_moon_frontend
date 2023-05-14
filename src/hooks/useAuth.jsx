import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function useAuth(code) {
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
                console.log(error);
            }
        }, (expiresIn - 60) * 1000);
        return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);

    return accessToken;
}
