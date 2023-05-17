import { Link } from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation";
import SpotifyLoginImg from "../../assets/images/SpotifyLogin.png";
import "./SpotifyLogin.scss";

const SpotifyLogin = ({ referrer }) => {
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=ab15df07233441198e07735bdb853e7b&response_type=code&redirect_uri=http://localhost:5173/music/login/${referrer}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

    console.log("AUTH_URL: " + AUTH_URL);
    return (
        <section id="spotifyLogin">
            <p className="logo light">SILENT MOON</p>

            <article id="spotifyLoginHeader">
                <div>
                    <img src={SpotifyLoginImg} alt="" />
                </div>
                <div>
                    <h1 className="heading1">Login required</h1>
                    <p className="textSmall">
                        If you want to play music you first have to log in with
                        a Spotify premium account.
                    </p>
                    <a href={AUTH_URL} className="bigRedButton">
                        Login With Spotify
                    </a>
                    <Link to="/music" className="textSmall">
                        Go back without loging in
                    </Link>
                </div>
            </article>
            <Navigation />
        </section>
    );
};

export default SpotifyLogin;
