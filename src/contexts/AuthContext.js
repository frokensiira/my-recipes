import { createContext, useContext, useState } from 'react';
import { auth } from '../firebase';

const AuthContext = createContext();

const useAuth = () => {
    return useContext(AuthContext);
}

const AuthContextProvider = props => {
    const [currentUser, setCurrentUser] = useState(null);

    const signup = (email, password) => {
        console.log(`Would sign up user with email ${email} and password ${password}`);
    }

    const contextValues = {
        currentUser,
        signup
    }

    return(
        <AuthContext.Provider value={contextValues}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, useAuth, AuthContextProvider as default} ;