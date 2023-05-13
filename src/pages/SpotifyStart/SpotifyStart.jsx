import MusicOverview from "../MusicOverview/MusicOverview";
import SpotifyLogin from "../SpotifyLogin/SpotifyLogin";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const SpotifyStart = () => {
    const [storedCode, setStoredCode] = useState(null);
    const cookies = new Cookies();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (!storedCode && code) {
            // Store the code in the cookie
            cookies.set("spotifyCode", code, { path: "/" });
            setStoredCode(code);
        } else if (!storedCode) {
            // Retrieve the code from the cookie
            const cookieCode = cookies.get("spotifyCode");
            setStoredCode(cookieCode);
        }
    }, [storedCode, cookies]);

    console.log("this is the stored code: " + storedCode);

    return storedCode ? (
        <MusicOverview storedCode={storedCode} />
    ) : (
        <SpotifyLogin />
    );
};

export default SpotifyStart;
