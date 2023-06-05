import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile,
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { auth, fstore } from "../firebase";

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
        await setUserWithRol(fstore, user);
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

    const setRolByUser = async () => {
        const rol = await getRolByUid(user.uid);
        console.log("rol: " + rol);
        if (rol == null) {
            await setUserWithRol(fstore, user);
        }
    }

    const logout = () => signOut(auth);

    const resetPassword = async (email) =>
        sendPasswordResetEmail(auth, email);

    const getInfoUser = async (userSession) => {
        const rol = await getRolByUid(userSession.uid);
        //console.log(rol);
        const userData = {
            uid: userSession.uid,
            email: userSession.email,
            rol: rol,
            displayName: userSession.displayName,
            photoURL: userSession.photoURL
        };
        return userData;
    }

    async function getRolByUid(uid) {
        const docRef = doc(fstore, `usuarios/${uid}`);
        const docCifrada = await getDoc(docRef);
        const data = docCifrada.data();
        let rolByUid = null;
        if (data != undefined) {
            rolByUid = data.rol;
        }
        // console.log(docCifrada.data().rol);
        return rolByUid;
    }

    async function setUserWithRol(fstore, user) {
        // se da de alta un registro en BD con el UID y este cuenta con el correo y rol de usuario
        const docuRef = await doc(fstore, `usuarios/${user.uid}`);
        setDoc(docuRef, { correo: user.email, rol: "MP-A", grupo: '' });
    }

    const updateInfoUser = async ( user) => {
        console.log(user);
        const docuRef = await doc(fstore, `usuarios/${user.uid}`);
        setDoc(docuRef, { correo: user.correo, rol: user.rol, grupo: user.grupo }, { merge: true });
    }

    useEffect(() => {
        const unsubuscribe = onAuthStateChanged(auth, currenUser => {
            setUser(currenUser);
            //console.log(currenUser);
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
                setRolByUser,
                resetPassword,
                getInfoUser,
                updateInfoUser,
            }}>
            {children}
        </authContext.Provider>
    );

}