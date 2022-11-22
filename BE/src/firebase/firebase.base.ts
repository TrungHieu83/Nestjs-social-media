import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBi3Ss9XsxJMHiyFzm-MjJB-d3fq9zpIwo",
    authDomain: "nestjs-project-6e3b0.firebaseapp.com",
    projectId: "nestjs-project-6e3b0",
    storageBucket: "nestjs-project-6e3b0.appspot.com",
    messagingSenderId: "115417645872",
    appId: "1:115417645872:web:13ea9b47af0c9cde047ef5",
    measurementId: "G-KNYNH0CCBV"
};

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp);


export { storage };