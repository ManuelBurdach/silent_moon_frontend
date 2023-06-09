import { useState, useEffect } from "react";
import MusicOverview from "../MusicOverview/MusicOverview";
import SpotifyLogin from "../SpotifyLogin/SpotifyLogin";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const SpotifyStart = () => {
    const [accessToken, setAccessToken] = useState();
    const [loading, setLoading] = useState(true);

    // der code wird von der Spotify Login Seite zurückgegeben. Wenn er hier leer bleibt wird die SpotifyLogin component gerendert
    const code = new URLSearchParams(window.location.search).get("code");

    console.log("Start");
    console.log(code);
    console.log(accessToken);
    console.log(loading);

    useEffect(() => {
        const login = async () => {
            // wenn ein code vorhandne ist, wird im backend ein access token angefordert und in den cookies gespeichert
            if (code) {
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
                    cookies.set("spotifyAccessToken", data.accessToken, {
                        path: "/",
                    });
                    cookies.set("spotifyRefreshToken", data.refreshToken, {
                        path: "/",
                    });
                    cookies.set("spotifyExpiresIn", data.expiresIn, {
                        path: "/",
                    });
                    window.history.pushState({}, null, "/");
                } catch (error) {
                    console.log(error);
                }
                // wenn kein code vorhanden ist, wird geprüft ob es schon einen token in den cookies gibt. wenn nicht wird die SpotifyLogin component gerendert
            } else {
                const spotifyAccessToken = cookies.get("spotifyAccessToken");
                if (spotifyAccessToken) {
                    setAccessToken(spotifyAccessToken);
                }
                setLoading(false);
            }
        };
        login();
    }, [code]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return accessToken ? (
        <MusicOverview accessToken={accessToken} />
    ) : (
        <SpotifyLogin />
    );
};

export default SpotifyStart;
