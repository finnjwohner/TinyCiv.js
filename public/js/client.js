const socket = io();
const menuCont = document.querySelector('div.menu-container');

let enteredGame = false;

const createPanel = player => {
    const playerPanel = document.createElement('div');
    playerPanel.id = player.id;
    playerPanel.classList.add('player-panel');

    if (!enteredGame)
        playerPanel.style.display = 'none';

    if(!player.entered) {
        playerPanel.style.background = 'grey';
        playerPanel.innerHTML = 'Joining...';
    }
    else {
        setTimeout(() => {
            displayFullPanel(player);
        }, 10);
    }

    menuCont.appendChild(playerPanel);
}

const displayFullPanel = player => {
    // Grabs the player's panel which currently displays 'joining'.
    const playerPanel = document.getElementById(player.id);

    // Sets the panel to display the correct info.
    playerPanel.innerHTML = `<h2>The Kingdom Of<br><b>${player.kingdom}</b></h2>
                            <div class="avatar">
                                <img src="./assets/avatars.png" alt="${player.name}'s Avatar">
                            </div>
                           <h3>${player.name}</h3>
                           <h4>READY</h4>`;

    // Set the player's avatar to the correct one, I call setTimeout because
    // the img element is currently not rendered on the dom, if I don't wait some time,
    // offsetWidth will return 0 instead of 1000, or whatever it is at the point of reading this.
    const playerPanelAvatar = document.querySelector(`#${player.id}.player-panel img`);
    setTimeout(() => {
       playerPanelAvatar.style.right = `${(playerPanelAvatar.offsetWidth / numAvatars) * (numAvatars - player.avatar)}px`;
    }, 10);
}

const enterLobby = () => {
    enteredGame = true;
    const avatar = getAvatar();
    const playerName = document.querySelector('#name-input').value;
    const kingdom = document.querySelector('#kingdom-input').value;

    socket.emit('enterLobby', avatar, playerName, kingdom);

    document.querySelector('#lobby-menu').remove();
    document.querySelectorAll('.player-panel').forEach(panel => {
        panel.style.display = null;
    })
}

// I define 'entering a lobby' as when the player has subbmited their info,
// e.g. name, kingdom name, avatar selected, and then pressed 'enter game'.
socket.on('playerEnteredLobby', player => {
    displayFullPanel(player);
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