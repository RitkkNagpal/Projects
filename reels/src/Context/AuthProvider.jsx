import { firebaseAuth } from "../config/firebase";
import React, { useState, useEffect } from 'react';

export const AuthContext = React.createContext();

export function AuthProvider({children}){


    const [user,setUser] =  useState(null);
    
    function signin(emainID , Password){
        return firebaseAuth.signInWithEmailAndPassword(emainID,Password);
    }

    function signout(){
        return firebaseAuth.signOut;
    }

    function signUp(emainID,Password){
        //
    }

    useEffect(()=>{
         firebaseAuth.onAuthStateChanged((user)=>{
             console.log("Inside Auth change" , user);
             setUser(user)
         });
         console.log(user);
    },[])

    let value = {
        currentUser : user,
        signin : signin,
        signUp : signUp,
        signout : signout
    };

    return (<AuthContext.Provider value ={value}>
        {children}
    </AuthContext.Provider>);
}