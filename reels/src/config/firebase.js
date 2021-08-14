import firebase from "firebase";

let firebaseConfig = {
  apiKey: "AIzaSyDRgsawtLhXRUjKKOfIpY1L3iMwR9GwMAg",
  authDomain: "login-fe941.firebaseapp.com",
  projectId: "login-fe941",
  storageBucket: "login-fe941.appspot.com",
  messagingSenderId: "785040093473",
  appId: "1:785040093473:web:d17b439d5691bde2840e60"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);

export let firebaseAuth = firebaseApp.auth();