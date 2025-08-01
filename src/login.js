import { auth, signInWithEmailAndPassword, onAuthStateChanged } from "./firebase.js";
import { showLoader, hideLoader } from "./helpers.js";

let email = document.getElementById("email");
let password = document.getElementById("password");
let loginForm = document.getElementById('loginForm');
let loader = document.getElementById("loader")

const loginUser = () => {
    showLoader();
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            hideLoader();
            location = "./home.html"
        })
        .catch((error) => {
            console.log(error);
            hideLoader();    
        });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        location = "./home.html";
    }
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginUser();
    loginForm.reset();
})
