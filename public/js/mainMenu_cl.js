const socket = io();

socket.on('connect', () => {
    console.log('Socket connection established...')
});

const hasRoomCode = () => {
    const req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    return req.getResponseHeader('roomCode');
}

/*
If headers contain a room code, the room code can be assumed
as invalid as the server has authenticated it.
*/
if (hasRoomCode()) {
    window.addEventListener('load', () => {
        const roomCodeError = document.querySelector('#room-code-error');
        roomCodeError.style.visibility = 'visible';
    })
}

const startNewGame = () => {
    socket.emit('startNewGame');
}

socket.on('acceptNewGame', roomCode => {
    window.location.replace(`./${roomCode}`);
});