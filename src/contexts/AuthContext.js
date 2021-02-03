import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { RingLoader } from 'react-spinners';

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
        signup,
        loading
    }

    return(
        <AuthContext.Provider value={contextValues}>
            {loading && (<div className="d-flex justify-content-center my-5"><RingLoader color={"#888"} size={50}/></div>)}
            {!loading && props.children}
        </AuthContext.Provider>
    )
}

export { AuthContext, useAuth, AuthContextProvider as default} ;