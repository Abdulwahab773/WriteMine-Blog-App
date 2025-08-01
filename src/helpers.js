let loader = document.getElementById("loader")
const showLoader = () => {
    loader.classList.remove("hidden");
}

const hideLoader = () => {
    loader.classList.add("hidden");
}

export {
    showLoader,
    hideLoader,
}