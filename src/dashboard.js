import { auth,onAuthStateChanged } from "./firebase.js"

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user);
    
  }
});
