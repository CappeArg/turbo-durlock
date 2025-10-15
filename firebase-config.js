const firebaseConfig = {
  apiKey: "AIzaSyBFzFmXCh4PsRr1Jr8OZNyaXpbBcQAozYw",
  authDomain: "turbo-durlock.firebaseapp.com",
  projectId: "turbo-durlock",
  storageBucket: "turbo-durlock.appspot.com",
  messagingSenderId: "495766775341",
  appId: "1:495766775341:web:3a20f1ff6fde6b0f483aa4",
  measurementId: "G-4B2Y1G9GJF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();