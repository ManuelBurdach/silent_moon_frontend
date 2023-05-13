const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=ab15df07233441198e07735bdb853e7b&response_type=code&redirect_uri=http://localhost:5173/music&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

const SpotifyLogin = () => {
    return (
        <div>
            <a href={AUTH_URL}>Login With Spotify</a>
        </div>
    );
};

export default SpotifyLogin;
