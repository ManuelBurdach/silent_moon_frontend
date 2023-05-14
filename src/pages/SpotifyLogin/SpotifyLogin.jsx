import { Link } from "react-router-dom";
import "./SpotifyLogin.scss";

const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=ab15df07233441198e07735bdb853e7b&response_type=code&redirect_uri=http://localhost:5173/music/login&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

const SpotifyLogin = () => {
    return (
        <div id="spotifyLogin">
            <h1 className="heading1">Login required</h1>
            <p className="textSmall">
                If you want to play music you first have to login with a Spotify
                premium account.
            </p>
            <a href={AUTH_URL} className="bigRedButton">
                Login With Spotify
            </a>
            <Link to="/music" className="textSmall">
                Go back without loging in
            </Link>
        </div>
    );
};

export default SpotifyLogin;
