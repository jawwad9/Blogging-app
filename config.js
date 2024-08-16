import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyDnvTpRjnvLe0DJmXT9OHYBzisFRtjjKEk",
  authDomain: "social-app-f4a76.firebaseapp.com",
  projectId: "social-app-f4a76",
  storageBucket: "social-app-f4a76.appspot.com",
  messagingSenderId: "512174458499",
  appId: "1:512174458499:web:0891f6f7f94fea87d57db6",
  measurementId: "G-JS8HJNFT7S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
