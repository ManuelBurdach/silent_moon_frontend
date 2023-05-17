import "./App.scss";
import { Routes, Route } from "react-router-dom";

import Start from "./pages/Start/Start";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Welcome from "./pages/Welcome/Welcome";
import ProtectRoutes from "./components/ProtectRoutes/ProtectRoutes";
import Home from "./pages/Home/Home";
import YogaDetails from "./pages/YogaDetails/YogaDetails";
import YogaOverview from "./pages/YogaOverview/YogaOverview";
import MeditationOverview from "./pages/MeditationOverview/MeditationOverview";
import MeditationDetails from "./pages/MeditationDetails/MeditationDetails";
import SpotifyStart from "./pages/SpotifyStart/SpotifyStart";
import MusicOverview from "./pages/MusicOverview/MusicOverview";
import Reminder from "./pages/Reminder/Reminder";
import UserProfile from "./pages/UserProfile/UserProfile";

import { userState } from "./state/userState";
import { useEffect } from "react";
import TimePicker from "./components/TimePicker/TimePicker";

function App() {
    const setUser = userState((state) => state.setUser);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    import.meta.env.VITE_BACKEND +
                        import.meta.env.VITE_API_VERSION +
                        "/user/verify",
                    {
                        credentials: "include",
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setUser(data);

                    history.back();
                } else {
                    setUser(data);
                    throw new Error("Authentification faild");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        })();
    }, []);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectRoutes />}>
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/reminder" element={<Reminder />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/yoga" element={<YogaOverview />} />
                    <Route
                        path="/yogadetails/:videoId"
                        element={<YogaDetails />}
                    />
                    <Route path="/meditate" element={<MeditationOverview />} />
                    <Route
                        path="/meditatedetails/:playlistId"
                        element={<MeditationDetails />}
                    />
                    <Route
                        path="/music/login/:referrer"
                        element={<SpotifyStart />}
                    />
                    <Route path="/music" element={<MusicOverview />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/test" element={<TimePicker />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
