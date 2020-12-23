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
        <div className="row">
            <div className="col-md-6 offset-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">Skapa konto</div>

                        {error && (<div className="alert alert-danger">{error}</div>)}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group" id="email">
                                <div className="form-label">
                                    Email
                                </div>
                                <input className="form-control" type="email" ref={emailRef} required/>
                            </div>

                            <div className="form-group" id="password">
                                <div className="form-label">
                                    Lösenord
                                </div>
                                <input className="form-control" type="password" ref={passwordRef} required/>
                            </div>

                            <div className="form-group" id="password-confirm">
                                <div className="form-label">
                                    Bekräfta lösenord
                                </div>
                                <input className="form-control" type="password" ref={passwordConfirmRef} required/>
                            </div>

                            <button disabled={loading} className="btn btn-primary">Skapa konto</button>
                        </form>
                    </div>
                </div>
                <div className="text-center mt-2">
                    Already have an account? <Link to='/login'>Log In</Link>
                </div>
            </div>
        </div>
        
    );
}
 
export default SignUp;