import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile
} from "firebase/auth";
import { auth } from "../firebase";

export const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error("Error: No hay proveedor de autenticación");
    return context;

}

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = async (email, password, displayName, photoURL) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // se agrega el nombre y la foto de perfil
    await updateProfile(user, { displayName, photoURL });
    setUser(user);
    };

    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const loginWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => signOut(auth);

    const resetPassword = async (email) =>
        sendPasswordResetEmail(auth, email);


    useEffect(() => {
        const unsubuscribe = onAuthStateChanged(auth, currenUser => {
            setUser(currenUser);
            // console.log(user);
            setLoading(false);
        });
        return () => unsubuscribe();
    }, []);

    return (
        <authContext.Provider
            value={{
                signup,
                login,
                user,
                logout,
                loading,
                loginWithGoogle,
                resetPassword,
            }}>
            {children}
        </authContext.Provider>
    );

}