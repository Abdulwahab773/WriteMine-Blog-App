import { auth, signInWithEmailAndPassword } from "./firebase.js";

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
            location = "./dashboard.html"
        })
        .catch((error) => {
            console.log(error);
            hideLoader();    
        });
}


const showLoader = () => {
    loader.classList.remove("hidden");
}

const hideLoader = () => {
    loader.classList.add("hidden");
}


loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginUser();
    loginForm.reset();
})
