import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Start from "./pages/Start/Start";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Welcome from "./pages/Welcome/Welcome";
import ProtectRoutes from "./components/ProtectRoutes/ProtectRoutes";
import Home from "./pages/Home/Home";
import YogaDetails from "./pages/YogaDetails/YogaDetails";
import YogaOverview from "./pages/YogaOverview/YogaOverview";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/yoga" element={<YogaOverview />} />
                    <Route
                        path="/yogadetails/:videoId"
                        element={<YogaDetails />}
                    />

                    <Route element={<ProtectRoutes />}>
                        <Route path="/welcome" element={<Welcome />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
