import { useRef } from 'react';

const SignUp = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef =  useRef();
    return (  
        <div className="row">
            <div className="col-md-6 offset-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">Skapa konto</div>
                        <form>
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
                                <input className="form-control" type="email" ref={passwordConfirmRef} required/>
                            </div>

                            <button className="btn btn-primary">Skapa konto</button>
                        </form>
                    </div>
                
                </div>
            </div>
        </div>
        
    );
}
 
export default SignUp;