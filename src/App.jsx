import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Start from "./pages/Start/Start";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Welcome from "./pages/Welcome/Welcome";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/welcome" element={<Welcome />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
