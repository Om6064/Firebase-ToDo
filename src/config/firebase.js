
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCb_N0_HEKGpfPkBW1ju3PDLpfY2YUx_hk",
  authDomain: "todo-app-5afb8.firebaseapp.com",
  projectId: "todo-app-5afb8",
  storageBucket: "todo-app-5afb8.firebasestorage.app",
  messagingSenderId: "697082974995",
  appId: "1:697082974995:web:ba3540f8928f9aee40c0e6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);