import { auth, onAuthStateChanged, db, collection, addDoc, signOut, doc, setDoc, Timestamp, updateDoc, onSnapshot, query, where, orderBy, increment, arrayUnion } from "./firebase.js"
import { showLoader, hideLoader } from "./helpers.js";

let navUserName = document.getElementById("navUserName");
let leftSideBarUserName = document.getElementById("leftSideBarUserName");
let leftSideBarUserEmail = document.getElementById("leftSideBarUserEmail");
let whatsOnYourMindBtn = document.getElementById("whatsOnYourMindBtn");
let modalUserName = document.getElementById("modalUserName");
let navBarProfilePic = document.getElementById('navBarProfilePic');
let leftSideBarProfilePic = document.getElementById('leftSideBarProfilePic');
let createPostProfilePic = document.getElementById("createPostProfilePic");
let modalProfilePic = document.getElementById("modalProfilePic");
let commentModalUserPic = document.getElementById("commentModalUserPic");
let postContent = document.getElementById("postContent");
let postBtn = document.getElementById('postBtn');
let logoutBtn = document.getElementById("logoutBtn");
let sidebarContacts = document.getElementById("sidebarContacts");
let allPosts = document.getElementById("allPosts");
let mainLoader = document.getElementById("mainLoader");
let bio = document.getElementById("bio");
let addbioBtn = document.getElementById('addbioBtn');
let addCommentBtn = document.getElementById("addCommentBtn");
let commentInput = document.getElementById("commentInput");
let commentsContainer = document.getElementById("commentsContainer");
let noCommentsSection = document.getElementById("noCommentsSection");
let userDropdownBtn = document.getElementById('userDropdownBtn');
let userDropdown = document.getElementById('userDropdown');
let currentUserUID = null;
let currentUserName = null;
let currentUserPic = null;
let currentPostId = null;


userDropdownBtn.addEventListener('click', () => {
  userDropdown.classList.toggle('hidden');
});

window.addEventListener('click', (e) => {
  if (!userDropdownBtn.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.classList.add('hidden');
  }
});

function openPostModal(type = 'post') {
  const modal = document.getElementById('postModal');
  const modalTitle = document.getElementById('modalTitle');

  switch (type) {
    case 'live':
      modalTitle.textContent = 'Create Live Video Post';
      break;
    case 'photo':
      modalTitle.textContent = 'Create Photo/Video Post';
      break;
    case 'feeling':
      modalTitle.textContent = 'Share Your Feeling';
      break;
    default:
      modalTitle.textContent = 'Create Post';
  }
  modal.classList.remove('hidden');
}

function closePostModal() {
  document.getElementById('postModal').classList.add('hidden');
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('imageUpload').value = '';
}

function closeCommentsModal() {
  document.getElementById('commentsModal').classList.add('hidden');
}

function previewFile() {
  const preview = document.getElementById('previewImage');
  const file = document.getElementById('imageUpload').files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
    document.getElementById('imagePreview').classList.remove('hidden');
  }

  if (file) {
    reader.readAsDataURL(file);
  }
}

function removeImage() {
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('imageUpload').value = '';
}

const startMainLoader = () => {
  mainLoader.classList.remove('hidden');
}

const stopMainLoader = () => {
  mainLoader.classList.add('hidden');
}

const showModalLoader = () => {
  document.getElementById("modalLoader").classList.remove('hidden')
}

const hideModalLoader = () => {
  document.getElementById("modalLoader").classList.add('hidden')
}

window.onclick = function (event) {
  if (event.target == document.getElementById('postModal')) {
    closePostModal();
  }
  if (event.target == document.getElementById('commentsModal')) {
    closeCommentsModal();
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserUID = user.uid;
    currentUserName = user.displayName;
    currentUserPic = user.photoURL;

    navUserName.innerHTML = user.displayName;
    leftSideBarUserName.innerHTML = user.displayName;
    leftSideBarUserEmail.innerHTML = user.email;
    modalUserName.innerHTML = user.displayName;
    whatsOnYourMindBtn.innerHTML = `What's on your mind, ${user.displayName}?`;
    postContent.placeholder = `What's on your mind, ${user.displayName}?`
    navBarProfilePic.src = user.photoURL;
    leftSideBarProfilePic.src = user.photoURL;
    createPostProfilePic.src = user.photoURL;
    modalProfilePic.src = user.photoURL;
    commentModalUserPic.src = user.photoURL;
  } else {
    location = "./index.html"
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const savedBio = localStorage.getItem("bio");
  if (savedBio) {
    bio.innerText = savedBio;
    addbioBtn.classList.add("hidden");
  }
});

const addBio = () => {
  const bioPrompt = prompt("Enter Bio Here");
  if (bioPrompt && bioPrompt.trim() !== "") {
    localStorage.setItem("bio", bioPrompt);
    bio.innerText = bioPrompt;
    addbioBtn.classList.add("hidden");
  }
};

const fileUpload = async () => {
  let imageUpload = document.getElementById("imageUpload");

  if (imageUpload.files.length > 0) {

    let file = imageUpload.files[0];

    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "WriteMine");

    try {
      let res = await fetch("https://api.cloudinary.com/v1_1/dsdnmgnpr/image/upload", {
        method: "POST",
        body: formData
      });
      let data = await res.json();
      return data.secure_url;

    } catch (error) {
      let er = error;
    }
  }
};

const createPost = async () => {
  showLoader();

  const postText = postContent.value.trim()

  if (!postText) {
    Swal.fire({
      title: "Error!",
      text: "Post field cannot be empty!",
      icon: "error"
    });
    hideLoader();
    closePostModal();
    return;
  }

  try {

    const docRef = await addDoc(collection(db, "posts"), {
      userName: currentUserName,
      userPic: currentUserPic,
      timestamp: Timestamp.now(),
      content: postText,
      uid: currentUserUID,
      likes: 0,
      image: await fileUpload() || "",
      comments: [],
      commentsCount: 0
    });

    await updateDoc(docRef, {
      docId: docRef.id
    });

    hideLoader();
    closePostModal();
  } catch (error) {
    console.log(error);
    hideLoader();
    closePostModal();
  }
}

postBtn.addEventListener('click', () => {
  createPost();
  postContent.value = "";
})

let getPosts = async () => {
  startMainLoader();

  let collectionRef = collection(db, "posts");
  let dbRef = query(collectionRef, orderBy("timestamp", "desc"))
  await onSnapshot(dbRef, (snapshot) => {
    allPosts.innerHTML = "";

    stopMainLoader();
    snapshot.forEach((docs) => {
      let data = docs.data();

      let createdAt = data.timestamp;
      let date = createdAt.toDate().toLocaleString();

      allPosts.innerHTML += `<div class="bg-white rounded-lg shadow">
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img src="${data.userPic}" alt="Profile"
            class="w-10 h-10 rounded-full object-cover">
            <div>
              <h3 class="font-semibold">${data.userName}</h3>
              <p class="text-gray-500 text-sm">${date}<i class="fas fa-user-friends ml-1"></i></p>
            </div>
        </div>
        <button class="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
          <i class="fas fa-ellipsis-h"></i>
        </button>
      </div>

      <div class="mt-3">
        <p>${data.content}</p>
      </div>
    </div>

    ${data.image ? `<div class="border-t border-gray-200">
      <img src="${data.image}"
        alt="Post" class="w-full object-cover">
    </div>` : ""}

    ${data.image ? `<div class="px-4 py-2 border-t border-gray-200 flex items-center justify-between text-gray-500 text-sm">` : `<div class="px-4 py-2  flex items-center justify-between text-gray-500 text-sm">`}
    
      <div class="flex items-center space-x-1">
        <i class="fas fa-thumbs-up text-blue-500"></i>
        <span>${data.likes}</span>
      </div>
      <div>
        <span>${data.commentsCount} Comments</span>
      </div>
    </div>

    <div class="px-4 py-2 border-t border-gray-200 grid grid-cols-3">
      <button id="likeBtn" onclick="handleLikes('${data.docId}'); triggerCelebration()" 
        class="flex items-center justify-center space-x-2 text-gray-500 hover:bg-gray-100 rounded-lg py-2">
        <i class="fas fa-thumbs-up"></i>
        <span>Like</span>
      </button>
      <button onclick="openCommentsModal('${data.docId}'); handelComments('${data.docId}')"
        class="flex items-center justify-center space-x-2 text-gray-500 hover:bg-gray-100 rounded-lg py-2">
        <i class="fas fa-comment"></i>
        <span>Comment</span>
      </button>
      <button
        class="flex items-center justify-center space-x-2 text-gray-500 hover:bg-gray-100 rounded-lg py-2">
        <i class="fas fa-share"></i>
        <span>Share</span>
      </button>
      </div>
      </div>`})
  })
}

const handelComments = async (id) => {
  const dbref = doc(db, "posts", id);
  currentPostId = id;

  const addComment = async () => {
    showModalLoader();
    if (!currentPostId) return;

    const commentText = commentInput.value.trim();

    if (!commentText) {
      Swal.fire({
        title: "Error!",
        text: "Comment field cannot be empty!",
        icon: "error"
      });
      hideModalLoader();
      return;
    }

    addCommentBtn.disabled = true;
    try {
      await updateDoc(dbref, {
        comments: arrayUnion({
          text: commentText,
          commentTime: Timestamp.now(),
          userName: currentUserName,
          userId: currentUserUID,
          userPic: currentUserPic
        })
      });

      await updateDoc(dbref, {
        commentsCount: increment(1)
      });

      commentInput.value = "";
      hideModalLoader();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add comment. Please try again!",
        icon: "error"
      });
      hideModalLoader();
    } finally {
      addCommentBtn.disabled = false;
    }
  };

  addCommentBtn.replaceWith(addCommentBtn.cloneNode(true));
  addCommentBtn = document.getElementById("addCommentBtn");
  addCommentBtn.addEventListener('click', addComment);
};

const openCommentsModal = async (id) => {

  document.getElementById('commentsModal').classList.remove('hidden');

  let collectionRef = collection(db, "posts");
  let dbRef = query(collectionRef, where("docId", "==", id))
  await onSnapshot(dbRef, (snapshot) => {
    commentsContainer.innerHTML = "";
    snapshot.forEach((docs) => {
      let data = docs.data();
      let allComments = data.comments;

      if (data.commentsCount === 0) {
        noCommentsSection.classList.remove('hidden')
      } else {
        noCommentsSection.classList.add('hidden')
      }

      allComments.map((comment) => {

        let createdAt = comment.commentTime;
        let date = createdAt.toDate().toLocaleString();

        commentsContainer.innerHTML += `  
<div class="flex space-x-3" >
    <img src="${comment.userPic}" alt="Profile"
      class="w-10 h-10 rounded-full mt-2 object-cover">
      <div class="flex-1">
        <div class="bg-gray-100 rounded-lg p-3">
          <h4 class="font-medium">${comment.userName}</h4>
          <p class="mt-1">${comment.text}
          </p>
        </div>
        <div class="flex items-center space-x-4 mt-1 ml-3 text-sm text-gray-500">
          <span>${date}</span>
          <button class="hover:text-gray-700">Like</button>
          <button class="hover:text-gray-700">Reply</button>
        </div>
      </div>
    </div>`})
    })
  })
}

const handleLikes = async (id) => {
  const dbref = doc(db, "posts", id);

  await updateDoc(dbref, {
    likes: increment(1)
  });
}

function triggerCelebration() {
  const container = document.getElementById('celebration-container');
  const emojis = ["🎉", "✨", "💖", "💥", "🔥"];

  for (let i = 0; i < 20; i++) {
    const emoji = document.createElement('div');
    emoji.classList.add('emoji');
    emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.top = (Math.random() * 50 + 30) + "vh";
    emoji.style.fontSize = (Math.random() * 24 + 16) + "px";

    container.appendChild(emoji);

    setTimeout(() => {
      emoji.remove();
    }, 1500);
  }
}

const getAllUsers = async () => {
  let collectionRef = collection(db, "users");
  let dbRef = query(collectionRef, orderBy("timeCreated", "desc"))
  await onSnapshot(dbRef, (snapshot) => {
    sidebarContacts.innerHTML = "";
    snapshot.forEach((docs) => {
      let data = docs.data();
      sidebarContacts.innerHTML +=
        `<div class="flex items-center space-x-3 p-1 hover:bg-gray-100 rounded cursor-pointer">
  <div class="relative">
    <img src="${data.image}" alt="Contact"
      class="w-8 h-8 rounded-full object-cover ">
      <div
        class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
      </div>
  </div>
  <span class="font-medium">${data.name}</span>
</div>`})
  })
}

const logout = () => {
  signOut(auth).then(() => {
    location = "./index.html";

  }).catch((error) => {
    Swal.fire({
      title: "Error!",
      text: "Something Went Wrong!",
      icon: "error"
    });
  });
}

logoutBtn.addEventListener('click', logout)

getAllUsers();
getPosts();

window.closeCommentsModal = closeCommentsModal;
window.openPostModal = openPostModal;
window.closePostModal = closePostModal;
window.previewFile = previewFile;
window.removeImage = removeImage;
window.addBio = addBio;
window.handelComments = handelComments;
window.openCommentsModal = openCommentsModal;
window.handleLikes = handleLikes;
window.triggerCelebration = triggerCelebration;