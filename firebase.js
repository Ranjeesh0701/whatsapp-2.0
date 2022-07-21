import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANfN6eBhfv4g5WAtIsVo03-CH4tsBKrvE",
  authDomain: "whatsapp-clone-a2f5c.firebaseapp.com",
  projectId: "whatsapp-clone-a2f5c",
  storageBucket: "whatsapp-clone-a2f5c.appspot.com",
  messagingSenderId: "297942903301",
  appId: "1:297942903301:web:45cb946f92729629ae4a6c",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
