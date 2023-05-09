import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/BackButton/BackButton";

const Register = () => {
    const nameRegisterRef = useRef();
    const surnameRegisterRef = useRef();
    const userRegisterRef = useRef();
    const passwordRegisterRef = useRef();

    const register = async (event) => {
        event.preventDefault();

        const navigate = useNavigate();

        const name = nameRegisterRef.current.value;
        const surname = surnameRegisterRef.current.value;
        const user = userRegisterRef.current.value;
        const password = passwordRegisterRef.current.value;

        try {
            const result = await fetch("http://localhost:4545/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ name, surname, user, password }),
            });

            if (result.ok) {
                console.log("Registered user: " + user);
                navigate("/welcome");
            } else {
                console.log("Error: ", result.statusText);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <section className="loginAndRegister">
            {/* the styles can be found in pages/Login/Login.scss */}
            <BackButton />
            <h1>Create your account</h1>
            <form>
                <input
                    ref={nameRegisterRef}
                    type="text"
                    name="nameRegister"
                    id="nameRegister"
                    placeholder="NAME"
                    required
                />
                <input
                    ref={surnameRegisterRef}
                    type="text"
                    name="surnameRegister"
                    id="surnameRegister"
                    placeholder="SURNAME"
                    required
                />
                <input
                    ref={userRegisterRef}
                    type="text"
                    name="userRegister"
                    id="userRegister"
                    placeholder="EMAIL"
                    required
                />
                <input
                    ref={passwordRegisterRef}
                    type="password"
                    name="passwordRegister"
                    id="passwordRegister"
                    placeholder="PASSWORD"
                    required
                />
                <input
                    type="submit"
                    value="REGISTER"
                    className="bigRedButton"
                />
            </form>
        </section>
    );
};

export default Register;
