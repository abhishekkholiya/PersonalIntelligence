import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth';
import firebase_app from './firebase.js';
import styles from '../styles/Loading.module.css';
import { BarLoader } from 'react-spinners';

let primaryColor


const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
               
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? 
            <div className={styles.container} style={{background:primaryColor ? primaryColor: 'blue'}}>
                <h1 className={styles.header}>Personal Intelligence</h1>
                <BarLoader color='white'/>
            </div> : children}
        </AuthContext.Provider>
    );
};