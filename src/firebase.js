import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBPzKkxRQIEQ2Bck6FCSwc_UGM0cWIuLfo",
    authDomain: "instagram-clone-2bb8c.firebaseapp.com",
    projectId: "instagram-clone-2bb8c",
    storageBucket: "instagram-clone-2bb8c.appspot.com",
    messagingSenderId: "842568839387",
    appId: "1:842568839387:web:5b9ef20daebd0dd8a75cfe"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };


  //export default db;yarn ad