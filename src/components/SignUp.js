import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef =  useRef();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        // check that the user entered the same password twice
        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("The passwords do not match");
        }

        setError(null);

        try {
            //try to sign up the user
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate('/');
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }

    }

    return (  
        <>
                <div className="">
                    <div className="">
                        <div className="">Skapa konto</div>

                        {error && (<div className="">{error}</div>)}

                        <form onSubmit={handleSubmit}>
                            <div className="" id="email">
                                <div className="">
                                    Email
                                </div>
                                <input className="" type="email" ref={emailRef} required/>
                            </div>

                            <div className="" id="password">
                                <div className="form-label">
                                    Lösenord
                                </div>
                                <input className="" type="password" ref={passwordRef} required/>
                            </div>

                            <div className="" id="password-confirm">
                                <div className="form-label">
                                    Bekräfta lösenord
                                </div>
                                <input className="" type="password" ref={passwordConfirmRef} required/>
                            </div>

                            <button disabled={loading} className="">Skapa konto</button>
                        </form>
                    </div>
                </div>
                <div className="">
                    Har du redan ett konto? <Link to='/login'>Logga in</Link>
                </div>
    </>
        
    );
}
 
export default SignUp;