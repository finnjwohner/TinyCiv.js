const avatarImg = document.querySelector('#avatar-select');
const numAvatars = 5;

let avatar = 1;

const getAvatar = () => { return avatar; }

const backAvatar = () => {
    if (avatar == 1)
        avatar = numAvatars;
    else
        avatar--;

    setAvatar(avatar);
}

const nextAvatar = () => {
    if (avatar == numAvatars)
        avatar = 1;
    else
        avatar++;

    setAvatar(avatar);
}

const setAvatar = avatarNum => {
    const right = `${(avatarImg.offsetWidth / numAvatars) * (numAvatars - avatarNum)}px`;
    avatarImg.style.right = right;
    return right;
};