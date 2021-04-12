import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import avocado from "../assets/images/avocado.png";

const SignUp = () => {
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signup, update } = useAuth();

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
            await update(usernameRef.current.value);
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

                    <div className="form__image-wrapper">
                    <h1>Inspirera och inspireras av de smarrigaste vegorecepten!</h1>
                        <p>Så fort du har registrerat dig kan du lägga in dina favoritrecept och spara andras favvisar till din egen samling.</p>
                        <img src={avocado} className="form__image" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        
                        <div className="form__inputs">
                            <div className="form__input-wrapper">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="form__icon"
                                />
                                <input
                                    className="form__input form__input-account"
                                    type="text"
                                    ref={usernameRef}
                                    placeholder="Användarnamn"
                                    required
                                />
                            </div>
                            <div className="form__input-wrapper">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="form__icon"
                                />
                                <input
                                    className="form__input form__input-account"
                                    type="email"
                                    ref={emailRef}
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            <div className="form__input-wrapper">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="form__icon"
                                />
                                <input
                                    className="form__input form__input-account"
                                    type="password"
                                    ref={passwordRef}
                                    placeholder="Lösenord"
                                    required
                                />
                            </div>

                            <div className="form__input-wrapper">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="form__icon"
                                />
                                <input
                                    className="form__input form__input-account"
                                    type="password"
                                    ref={passwordConfirmRef}
                                    placeholder="Bekräfta lösenord"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form__button">
                            <button disabled={loading} className="button">
                                Skapa konto
                            </button>
                        </div>
                        <div className="form__text">
                            <p>Har du redan ett konto? <Link to="/login" className="form__link">Logga in</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignUp;
