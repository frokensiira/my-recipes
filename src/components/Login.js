import { Link, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import avocado from "../assets/images/avocado.png";
import Loading from "./Loading";
import FormButton from "./FormButton";
import InputMail from "./InputMail";
import InputPassword from "./InputPassword";
import { motion } from "framer-motion";

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
        <main>
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 1 }}
                className="form"
            >
                {loading && <Loading />}
                <div className="form__wrapper">
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
                        {error && (
                            <div className="error">
                                <p>{error}</p>
                            </div>
                        )}
                        <div className="form__inputs">
                            <InputMail emailRef={emailRef} />
                            <InputPassword passwordRef={passwordRef} />
                        </div>
                        
                        <FormButton loading={loading} disabled={loading}>Logga in</FormButton>

                        <p className="form__text">
                            Har du inget konto?&nbsp;{" "}
                            <Link to="/signup">Skapa konto</Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </main>
    );
};

export default Login;
