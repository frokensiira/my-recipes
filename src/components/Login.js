import { Link, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import avocado from "../assets/images/avocado.png";
import Loading from "./Loading";
import FormButton from "./FormButton";
import InputMail from "./InputMail";
import InputPassword from "./InputPassword";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate("/");
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className="page">
            <h1 className="page__title">Logga in</h1>
            {loading && <Loading />}
            <div className="form__wrapper">
                <div className="form">
                    <div className="form__image-wrapper">
                        <h1 className="form__heading">Välkommen tillbaka!</h1>
                        <p className="form__text">
                            Logga in och se alla nya recept som dykt upp sen
                            sist och glöm inte att lägga in dina senaste
                            favoriter.
                        </p>
                        <img src={avocado} className="form__image" alt="" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <h2 className="form__heading">Logga in!</h2>
                        <div className="form__inputs">
                            <InputMail emailRef={emailRef} />
                            <InputPassword passwordRef={passwordRef}/>
                        </div>
                        <FormButton loading={loading}>Logga in</FormButton>

                        <p className="form__text">
                            Har du inget konto?&nbsp;{" "}
                            <Link to="/signup">Skapa konto</Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Login;
