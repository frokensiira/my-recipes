import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import avocado from "../assets/images/avocado.png";
import FormButton from "./FormButton";
import Loading from "./Loading";
import InputMail from "./InputMail";
import InputPassword from "./InputPassword";
import { motion } from "framer-motion";

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
            {loading && <Loading />}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 1 }}
                className="form"
            >
                <div className="form__wrapper">
                    <div className="form__image-wrapper">
                        <h1 className="form__heading">
                            Inspirera och inspireras!
                        </h1>
                        <p className="form__text">
                            Så fort du har registrerat dig kan du lägga in dina
                            favoritrecept och spara andras smarriga vegorecept
                            till din egen samling.
                        </p>
                        <img src={avocado} className="form__image" alt="" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <h2 className="form__heading">Registrera mig!</h2>
                        {error && (
                            <div className="error">
                                <p>{error}</p>
                            </div>
                        )}
                        <div className="form__inputs">
                            <div className="form__input-wrapper" htmlFor="name">
                                <div className="form-input__user form-input__container"></div>
                                <input
                                    className="form__input form__input-account"
                                    type="text"
                                    ref={usernameRef}
                                    placeholder="Användarnamn"
                                    required
                                    id="name"
                                />
                            </div>

                            <InputMail emailRef={emailRef} />
                            <InputPassword passwordRef={passwordRef} />
                            <InputPassword passwordRef={passwordConfirmRef} />
                        </div>
                        <FormButton loading={loading}>Skapa konto</FormButton>
                        <div className="form__text">
                            <p>
                                Har du redan ett konto? &nbsp;
                                <Link to="/login" className="form__link">
                                    Logga in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </>
    );
};

export default SignUp;
