// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTIzIT9GYAIzjnhVUyAk4RdYnTadqpJoY",
  authDomain: "kosmo-5b793.firebaseapp.com",
  databaseURL: "https://kosmo-5b793-default-rtdb.firebaseio.com",
  projectId: "kosmo-5b793",
  storageBucket: "kosmo-5b793.appspot.com",
  messagingSenderId: "534784559334",
  appId: "1:534784559334:web:dee295227c2e43bc3a9327"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);