import { auth, createUserWithEmailAndPassword, updateProfile } from "./firebase.js";

let loader = document.getElementById("loader");
let signUpForm = document.getElementById("signUpForm");



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

    let uploadedImageURL = "https://example.com/default-avatar.png";

    try {
        const profilePic = document.getElementById("profilePic");
        if (profilePic.files.length > 0) {
            uploadedImageURL = await fileUpload();
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: name,
            photoURL: uploadedImageURL,
        });

        location = "./dashboard.html";
        hideLoader();

    } catch (error) {
        console.log("❌ Error in signup:", error);
        hideLoader();
    }
};




const showLoader = () => {
    loader.classList.remove("hidden");
}

const hideLoader = () => {
    loader.classList.add("hidden");
}

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    showLoader();
    signUp();
    signUpForm.reset();
})


window.fileUpload = fileUpload;