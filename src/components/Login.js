import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError ] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/');
        } catch (error) {
            setError(error.message);
			setLoading(false);
        }
    }

    return (  
        <>
            <h1 className="page__title">Logga in</h1>
            <div className="form__wrapper">
                <div className="form">

                    {error && (<div variant="danger">{error}</div>)}

                    <form onSubmit={handleSubmit}>
                        
                        <div className="form__input">
                            <FontAwesomeIcon icon={faUser} className="form__icon"/>
                            <input type="email" ref={emailRef} placeholder="Email" required/>
                        </div>

                        <div className="form__input">
                            <FontAwesomeIcon icon={faLock} className="form__icon"/>
                            <input type="password" ref={passwordRef} required placeholder="Lösenord"/>
                        </div>
                        
                        <div className="form__button">
                            <button disabled={loading} type="submit" className="">Logga in</button>
                            
                        </div>
                    </form>
                    <p className="form__text">Har du inget ett konto? <Link to="/signup">Skapa konto</Link></p>
                </div>
            </div>
        </>
    );
}
 
export default Login;