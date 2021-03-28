import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // check that the user entered the same password twice
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("The passwords do not match");
        }

        setError(null);

        try {
            //try to sign up the user
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate("/");
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="page__title">Skapa konto</h1>
            <div className="form__wrapper">
                <div className="form">
                    {error && <div className="">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form__inputs">
                            <div className="form__input">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="form__icon"
                                />
                                <input
                                    className=""
                                    type="email"
                                    ref={emailRef}
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            <div className="form__input">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="form__icon"
                                />
                                <input
                                    className=""
                                    type="password"
                                    ref={passwordRef}
                                    placeholder="Lösenord"
                                    required
                                />
                            </div>

                            <div className="form__input">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="form__icon"
                                />
                                <input
                                    className=""
                                    type="password"
                                    ref={passwordConfirmRef}
                                    placeholder="Bekräfta lösenord"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form__button">
                            <button disabled={loading} className="form__button">
                                Skapa konto
                            </button>
                        </div>
                    </form>

                    <div className="form__text">
                        Har du redan ett konto?{" "}
                        <Link to="/login">Logga in</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
