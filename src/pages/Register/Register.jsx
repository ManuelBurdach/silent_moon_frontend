import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../components/BackButton/BackButton";
import { userState } from "../../state/userState";

const Register = () => {
  const nameRegisterRef = useRef();
  const surnameRegisterRef = useRef();
  const emailRegisterRef = useRef();
  const passwordRegisterRef = useRef();
  const navigate = useNavigate();
  const setUser = userState((state) => state.setUser);

  const register = async (event) => {
    event.preventDefault();

    const name = nameRegisterRef.current.value;
    const surname = surnameRegisterRef.current.value;
    const email = emailRegisterRef.current.value;
    const password = passwordRegisterRef.current.value;

    try {
      const result = await fetch(
        import.meta.env.VITE_BACKEND + import.meta.env.VITE_API_VERSION + "/user/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            firstName: name,
            lastName: surname,
            email: email,
            password: password,
          }),
        }
      );
      const response = await result.json();
      if (result.ok) {
        console.log("Registered email: " + email);
        setUser(response);
        navigate("/welcome");
      } else if (result.status === 550) {
        //Hinweis ins frontend
        console.log("Error: email existiert bereits");
      } else {
        console.log("Error: Server error");
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
      <form onSubmit={register}>
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
          ref={emailRegisterRef}
          type="email"
          name="emailRegister"
          id="emailRegister"
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
        <input type="submit" value="REGISTER" className="bigRedButton" />
      </form>
    </section>
  );
};

export default Register;
