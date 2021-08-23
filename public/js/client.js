const socket = io();
const menuCont = document.querySelector('div.menu-container');

let enteredGame = false;

// I define 'entering a lobby' as when the player has subbmited their info,
// e.g. name, kingdom name, avatar selected, and then pressed 'enter game'.
socket.on('playerEnteredLobby', player => {
    setTimeout(displayFullPanel(player), 10);
})

socket.on('playerJoining', player => {
    createPanel(player);
});

socket.on('playerLeaving', id => {
    const playerPanel = document.querySelector(`div#a${id}.player-panel`);
    
    if (playerPanel) { playerPanel.remove(); };
});

socket.on('joinLobby', players => {
    players.forEach(player => {
        createPanel(player);
    })
});

socket.on('gameReady', () => {
    const popup = document.querySelector('.pop-up-container');
    popup.style.display = null;
})

const hasRoomCode = () => {
    const req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    return req.getResponseHeader('roomCode');
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

const readyBtnToggle = player => {
    const readyBtn = document.querySelector(`div#a${player.id}.player-panel h4`);

    if (player.ready) {
        readyBtn.classList.add('ready-btn-ready');
        readyBtn.classList.remove('ready-btn-notready');
        readyBtn.innerHTML = 'READY';
    }
    else {
        readyBtn.classList.add('ready-btn-notready');
        readyBtn.classList.remove('ready-btn-ready');
        readyBtn.innerHTML = 'NOT READY';
    }
}

socket.on('playerReadyToggleReceive', player => {
    console.log('do be togglin');
    readyBtnToggle(player);
});

const createPanel = player => {
    const playerPanel = document.createElement('div');
    menuCont.appendChild(playerPanel);

    playerPanel.id = 'a' + player.id;
    playerPanel.classList.add('player-panel');

    if (!enteredGame)
        playerPanel.style.display = 'none';

    if(!player.entered) {
        playerPanel.style.background = 'grey';
        playerPanel.innerHTML = 'Joining...';
    }
    else {
        setTimeout(displayFullPanel(player), 10);
    }
}

const displayFullPanel = player => {
    // Grabs the player's panel which currently displays 'joining'.
    const playerPanel = document.querySelector(`div#a${player.id}.player-panel`);


    // Sets the panel to display the correct info.
    playerPanel.innerHTML = `<h2>The Kingdom Of<br><b>${player.kingdom}</b></h2>
                            <div class="avatar">
                                <img src="./assets/player-avatars.png" alt="${player.name}'s Avatar">
                            </div>
                           <h3>${player.name}</h3>
                           <h4></h4>`;

    const playerPanelAvatar = document.querySelector(`div#a${player.id}.player-panel img`);
    const playerPanelAvatarDiv = document.querySelector(`div#a${player.id}.player-panel div.avatar`);
    const playerPanelh2 = document.querySelector(`div#a${player.id}.player-panel h2`);
    const playerPanelh4 = document.querySelector(`div#a${player.id}.player-panel h4`);

    readyBtnToggle(player);

    if (player.id == socket.id) {
        playerPanelh4.classList.add('ready-btn');
        playerPanelh4.addEventListener('click', () => {
            socket.emit('playerReadyToggle', player.id);
        })
    }

    switch(player.colour) {
        case 'red':
            playerPanel.style.background = '#a83232';
            playerPanelh2.style.background = '#5c0f0f';
            playerPanelAvatarDiv.style.background = '#b71c1c';
            break;
        case 'green':
            playerPanel.style.background = '#22c517';
            playerPanelh2.style.background = '#17972c';
            playerPanelAvatarDiv.style.background = '#0bb100';
            break;
        case 'blue':
            playerPanel.style.background = '#43aed1';
            playerPanelh2.style.background = '#1093af';
            playerPanelAvatarDiv.style.background = '#2196f3';
            break;
        case 'purple':
            playerPanel.style.background = '#9a3bd1';
            playerPanelh2.style.background = '#8410c7';
            playerPanelAvatarDiv.style.background = '#4a148c';
            break;
        default:
            console.error(`Error changing player colour to (${player.colour}) in client.js`);
            break;
    }

    // Set the player's avatar to the correct one, I call setTimeout because
    // the img element is currently not rendered on the dom, if I don't wait some time,
    // offsetWidth will return 0 instead of 1000, or whatever it is at the point of reading this.
    setTimeout(() => {
       playerPanelAvatar.style.right = `${(1000 / 5) * (player.avatar - 1)}px`;
    }, 10);
}

const roomCode = hasRoomCode();
const roomCodeText = document.querySelector('#room-code');
roomCodeText.innerHTML = `Room ${roomCode}`;

socket.emit('join', roomCode);