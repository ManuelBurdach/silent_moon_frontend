import "./Login.scss";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import BackButton from "../../components/BackButton/BackButton";

const Login = () => {
    const navigate = useNavigate();

    const userLoginRef = useRef();
    const passwordLoginRef = useRef();

    const login = async (event) => {
        event.preventDefault();

        const userLogin = userLoginRef.current.value;
        const passwordLogin = passwordLoginRef.current.value;

        try {
            const result = await fetch("http://localhost:4545/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    user: userLogin,
                    password: passwordLogin,
                }),
            });

            if (result.ok) {
                console.log("Logged in user: " + userLogin);
                navigate("/");
            } else {
                console.log("Error: ", result.statusText);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <section className="loginAndRegister">
            <BackButton />
            <h1>Welcome Back!</h1>
            <form onSubmit={login}>
                <input
                    ref={userLoginRef}
                    type="text"
                    name="userLogin"
                    id="userLogin"
                    placeholder="EMAIL"
                    required
                />
                <input
                    ref={passwordLoginRef}
                    type="password"
                    name="passwordLogin"
                    id="passwordLogin"
                    placeholder="PASSWORD"
                    required
                />
                <input type="submit" value="LOGIN" className="bigRedButton" />
            </form>
            <p>
                Don't have an account yet? <Link to="/register">Sign up</Link>
            </p>
        </section>
    );
};

export default Login;
