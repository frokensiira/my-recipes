import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

const AuthContext = createContext();

const useAuth = () => {
    return useContext(AuthContext);
}

const AuthContextProvider = props => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    const login = (email, password) => {
        console.log('logging in');
        return auth.signInWithEmailAndPassword(email, password)
    }

    const logout = () => {
        console.log('logging out');
        return auth.signOut();
    }

    //when any of the child components mounts, check if the user is logged in or out
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user)=> {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, [])

    const contextValues = {
        currentUser,
        loading,
        signup,
        login,
        logout,
    }

    return(
        <AuthContext.Provider value={contextValues}>
            {loading && (<div></div>)}
            {!loading && props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, useAuth, AuthContextProvider as default} ;