const mainMenu = document.querySelector('#main-menu');
const joinMenu = document.querySelector('#join-menu');
const roomCodeInput = document.querySelector('#room-code-input');
const joinInputError = document.querySelector('#join-input-error');
const roomCodeError = document.querySelector('#room-code-error');

const openJoinMenu = () => {
    roomCodeError.style.visibility = 'hidden';
    roomCodeInput.value = '';
    joinInputError.style.visibility = 'hidden';
    mainMenu.style.display = 'none';
    joinMenu.style.display = null;
}

const openMainMenu = () => {
    mainMenu.style.display = null;
    joinMenu.style.display = 'none';
}

// Function that joins a game when room code inputted
const joinGame = () => {
    // Validate room code input (5 chars & numbers)
    const code = roomCodeInput.value;
    if (!isNaN(code) && code.length == 5) {
        window.location.replace(`./${code}`);
    }
    else {
        joinInputError.style.visibility = 'visible';
        joinInputError.classList.remove('error-msg-transition');
        joinInputError.style.background = 'red';
        setTimeout(() => {
            joinInputError.classList.add('error-msg-transition');
            joinInputError.style.background = 'none';
        }, 0);
    }
}