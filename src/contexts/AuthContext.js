import { createContext, useState } from 'react';
import { auth } from '../firebase';

export const AuthContext = createContext();

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

export default AuthContextProvider;