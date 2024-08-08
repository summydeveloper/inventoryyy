 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore"
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyDDi6fl4n2OhfqHlUUWo3Yx6PuTz_lwiyA",
   authDomain: "inventory-system-28e17.firebaseapp.com",
   projectId: "inventory-system-28e17",
   storageBucket: "inventory-system-28e17.appspot.com",
   messagingSenderId: "779262841044",
   appId: "1:779262841044:web:da93b8dd971470b68b2b41",
   measurementId: "G-4DS3HZSBDG"
 };
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
  const firestore= getFirestore(app);

 export {firestore}