const socket = io();
const menuCont = document.querySelector('div.menu-container');

const createPanel = player => {
    const playerPanel = document.createElement('div');
    playerPanel.id = player.id;
    playerPanel.classList.add('player-panel');
    playerPanel.style.display = 'none';

    if(!player.joined) {
        playerPanel.style.background = 'grey';
        playerPanel.innerHTML = 'Joining...';
    }
    else {

    }

    menuCont.appendChild(playerPanel);
}

const enterLobby = () => {
    const avatar = getAvatar();
    const playerName = document.querySelector('#name-input').value;
    const kingdom = document.querySelector('#kingdom-input').value;

    socket.emit('enterLobby', avatar, playerName, kingdom);

    document.querySelector('#lobby-menu').style.display = 'none';
    document.querySelectorAll('.player-panel').forEach(panel => {
        panel.style.display = null;
    })
}

socket.on('playerEnteredLobby', player => {
    const playerPanel = document.querySelector(`#${player.id}.player-panel`);
    playerPanel.innerHTML = `<h2>The Kingdom Of<br><b>${player.kingdom}</b></h2>
                            <div class="avatar">
                                <img src="./assets/avatars.png" alt="${player.name}'s Avatar">
                            </div>
                            <h3>${player.name}</h3>
                            <h4>READY</h4>`;

    const playerImg = document.querySelector(`#${player.id}.player-panel img`);
    const rightPixels = 200 * (5 - player.avatar);
    playerImg.style.right = `${rightPixels}px`;
})

socket.on('playerJoining', player => {
    createPanel(player);
});

socket.on('playerLeaving', id => {
    const playerPanel = document.querySelector(`#${id}.player-panel`);
    
    if (playerPanel) { playerPanel.remove(); };
});

socket.on('joinLobby', players => {
    players.forEach(player => {
        createPanel(player);
    })
});

const hasRoomCode = () => {
    const req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    return req.getResponseHeader('roomCode');
}

const roomCode = hasRoomCode();
const roomCodeText = document.querySelector('#room-code');
roomCodeText.innerHTML = `Room ${roomCode}`;

socket.emit('join', roomCode);