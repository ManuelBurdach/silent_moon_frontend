import MusicOverview from "../MusicOverview/MusicOverview";
import SpotifyLogin from "../SpotifyLogin/SpotifyLogin";
import useAuth from "../../hooks/useAuth";

const SpotifyStart = () => {
    const code = new URLSearchParams(window.location.search).get("code");
    let accessToken = useAuth(code);

    return accessToken ? (
        <MusicOverview accessToken={accessToken} />
    ) : (
        <SpotifyLogin />
    );
};

export default SpotifyStart;
