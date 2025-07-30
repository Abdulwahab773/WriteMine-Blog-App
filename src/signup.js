import { auth, createUserWithEmailAndPassword, updateProfile, signInWithPopup, provider , addDoc , collection, Timestamp, db } from "./firebase.js";
import { showLoader, hideLoader } from "./helpers.js";

let loader = document.getElementById("loader");
let signUpForm = document.getElementById("signUpForm");
let googleBtn = document.getElementById("googleBtn");


const fileUpload = async () => {
    showLoader();
    let profilePic = document.getElementById("profilePic");
    let file = profilePic.files[0];

    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "WriteMine");

    try {
        let res = await fetch("https://api.cloudinary.com/v1_1/dsdnmgnpr/image/upload", {
            method: "POST",
            body: formData
        });
        let data = await res.json();
        hideLoader();
        return data.secure_url;

    } catch (error) {
        console.log("❌ Cloudinary upload error:", error);
        hideLoader();
        throw error;
    }
};



const signUp = async () => {
    showLoader();

    const name = document.getElementById("fullName")?.value?.trim();
    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value;

    let uploadedImageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpwxCN33LtdMLbWdhafc4HxabqpaU0qVbDxQ&s";

    try {
        const profilePic = document.getElementById("profilePic");
        if (profilePic.files.length > 0) {
            uploadedImageURL = await fileUpload();
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const docRef = await addDoc(collection(db, "users"), {
            name,
            image: uploadedImageURL,
            timeCreated: Timestamp.now() 
        });
        await updateProfile(userCredential.user, {
            displayName: name,
            photoURL: uploadedImageURL,
        });

        location = "./home.html";
        hideLoader();

    } catch (error) {
        console.log("❌ Error in signup:", error);
        hideLoader();
    }
};


googleBtn.addEventListener('click', async () => {
    showLoader();

    try {
        const result = await signInWithPopup(auth, provider);
        location = "./home.html";

    } catch (error) {
        alert("Google Sign-in Failed: " + error.message);
    } finally {
        hideLoader(); 
    }

})





signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    showLoader();
    signUp();
    signUpForm.reset();
})


window.fileUpload = fileUpload;