const avatarSelectImg = document.querySelector('#avatar-select');
const numAvatars = 5;

let selectedAvatar = 1;

const getAvatar = () => { return selectedAvatar; }

const backAvatar = () => {
    if (selectedAvatar == 1)
        selectedAvatar = numAvatars;
    else
        selectedAvatar--;

    setAvatar();
}

const nextAvatar = () => {
    if (selectedAvatar == numAvatars)
        selectedAvatar = 1;
    else
        selectedAvatar++;

    setAvatar();
}

const setAvatar = () => {
    avatarSelectImg.style.right = `${(avatarSelectImg.offsetWidth / numAvatars) * (selectedAvatar - 1)}px`;
};

setAvatar();