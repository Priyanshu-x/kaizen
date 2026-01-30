import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA1phSfzUve-yfhw9K0OfvOaxB7BRjGDMY",
    authDomain: "automatic-curve-454616-p3.firebaseapp.com",
    projectId: "automatic-curve-454616-p3",
    storageBucket: "automatic-curve-454616-p3.firebasestorage.app",
    messagingSenderId: "336250055569",
    appId: "1:336250055569:web:68064ea13f78824b6d0830",
    measurementId: "G-75TELXZDFJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
