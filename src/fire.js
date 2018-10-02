import firebase from "firebase";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBlLzI9_bjiLewA02qxWUtgqIecUdWuhnk",
    authDomain: "chatting-app-fc7aa.firebaseapp.com",
    databaseURL: "https://chatting-app-fc7aa.firebaseio.com",
    projectId: "chatting-app-fc7aa",
    storageBucket: "chatting-app-fc7aa.appspot.com",
    messagingSenderId: "447362668256"
};
const fire = firebase.initializeApp(config);

export default fire;