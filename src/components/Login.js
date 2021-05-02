import { Link, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import avocado from "../assets/images/avocado.png";
import Loading from "./Loading";
import FormButton from "./FormButton";

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
        <>
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
                            <div className="form__input-wrapper">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="form__icon"
                                />
                                <input
                                    type="email"
                                    ref={emailRef}
                                    placeholder="Email"
                                    required
                                    className="form__input form__input-account"
                                />
                            </div>

                            <div className="form__input-wrapper">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="form__icon"
                                />
                                <input
                                    type="password"
                                    ref={passwordRef}
                                    required
                                    placeholder="Lösenord"
                                    className="form__input form__input-account"
                                />
                            </div>
                        </div>
                        <FormButton loading={loading}>Logga in</FormButton>

                        <p className="form__text">
                            Har du inget konto?&nbsp;{" "}
                            <Link to="/signup">Skapa konto</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
