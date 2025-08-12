// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOibjNBwtoQ8nfYv387KaCBGdw_TOhFg8",
  authDomain: "webapp1-68329.firebaseapp.com",
  projectId: "webapp1-68329",
  storageBucket: "webapp1-68329.firebasestorage.app",
  messagingSenderId: "465847355634",
  appId: "1:465847355634:web:b3ac1e5f0c78d20a6da86b",
  measurementId: "G-Q8YFGYCHYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const  auth= getAuth(app);
const db = getFirestore(app); // ← Firestoreを初期化
export {auth,db};// ← db をエクスポート