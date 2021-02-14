import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

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
        <div>
            <div>
                <div>
                    <div className="">
                        <div className="">
                            <div className="">
                                Logga in
                            </div>

                            {error && (<div variant="danger">{error}</div>)}

                            <form onSubmit={handleSubmit}>
                                
                                <div>
                                    <label ><FontAwesomeIcon icon={faUser}/></label>
                                    
                                    <div className="">
                                        <input className="" type="email" ref={emailRef} placeholder="Email" required/>
                                    </div>
                                </div>

                                <div>
                                    <label ><FontAwesomeIcon icon={faUnlockAlt}/></label>
                                    <div className="">
                                        <input className="" type="password" ref={passwordRef} required placeholder="Lösenord"/>
                                    </div>
                                </div>
                                

                                <button disabled={loading} type="submit" className="">Logga in</button>
                            </form>
                            <p>Har du inget ett konto? <Link to="/signup">Skapa konto</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Login;