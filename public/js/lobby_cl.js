export const gameReady = (players) => {
    const popup = document.querySelector('.pop-up-container');

    popup.style.display = null;

    const aside = document.querySelector('aside');
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card');
        playerCard.id = 'a' + player.id;
        aside.appendChild(playerCard);

        playerCard.innerHTML = `<div class="player-card-container">
                                    <div class="text">
                                        <h2>${player.name}</h2>
                                        <h3>${player.kingdom}</h3>
                                    </div>
                                    <div class="card-avatar">
                                        <img src="./assets/player-avatars.png" alt="${player.name}'s Avatar">
                                    </div>
                                </div>`;


        setPlayerColours(player, playerCard, null, document.querySelector(`#a${player.id}.player-card .card-avatar`));

        const avatar = document.querySelector(`#a${player.id}.player-card img`);
        setTimeout(() => {
            avatar.style.right = `${(125) * (player.avatar - 1)}px`;
         }, 10);
    })
}

export const enterLobby = socket => {
    const avatar = getAvatar();
    const playerName = document.querySelector('#name-input').value;
    const kingdom = document.querySelector('#kingdom-input').value;

    socket.emit('enterLobby', avatar, playerName, kingdom);

    document.querySelector('#lobby-menu').remove();
    document.querySelectorAll('.player-panel').forEach(panel => {
        panel.style.display = null;
    })

    return true;
}

const setPlayerColours = (player, main, dark, avatar) => {
    setTimeout(() => {
        switch(player.colour) {
            case 'red':
                main.style.background = '#a83232';

                if (dark)
                    dark.style.background = '#5c0f0f';

                avatar.style.background = '#b71c1c';
                break;
            case 'green':
                main.style.background = '#22c517';

                if (dark)
                    dark.style.background = '#17972c';

                avatar.style.background = '#0bb100';
                break;
            case 'blue':
                main.style.background = '#43aed1';

                if (dark)
                    dark.style.background = '#1093af';

                avatar.style.background = '#2196f3';
                break;
            case 'purple':
                main.style.background = '#9a3bd1';

                if (dark)
                    dark.style.background = '#8410c7';

                avatar.style.background = '#4a148c';
                break;
            default:
                console.error(`Error changing player colour to (${player.colour}) in client.js`);
                break;
        }
    }, 10);
}

export const playerLeaving = id => {
    const playerPanel = document.querySelector(`div#a${id}.player-panel`);
    if (playerPanel) { playerPanel.remove(); };
}

export const playerEnteredLobby = (player, socket) => {
    setTimeout(displayFullPanel(player, socket), 10);
}

const displayFullPanel = (player, socket) => {
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

    setPlayerColours(player, playerPanel, playerPanelh2, playerPanelAvatarDiv);

    // Set the player's avatar to the correct one, I call setTimeout because
    // the img element is currently not rendered on the dom, if I don't wait some time,
    // offsetWidth will return 0 instead of 1000, or whatever it is at the point of reading this.
    setTimeout(() => {
       playerPanelAvatar.style.right = `${(1000 / 5) * (player.avatar - 1)}px`;
    }, 10);
}

export const createPanel = (player, enteredLobby, socket) => {
    const playerPanel = document.createElement('div');
    document.querySelector('div.menu-container').appendChild(playerPanel);

    playerPanel.id = 'a' + player.id;
    playerPanel.classList.add('player-panel');

    if (!enteredLobby)
        playerPanel.style.display = 'none';

    if(!player.entered) {
        playerPanel.style.background = 'grey';
        playerPanel.innerHTML = 'Joining...';
    }
    else {
        setTimeout(displayFullPanel(player, socket), 10);
    }
}

export const readyBtnToggle = player => {
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

export const initialJoin = socket => {
    const req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    const roomCode = req.getResponseHeader('roomCode');

    document.querySelectorAll('#room-code').forEach(text => {
        text.innerHTML = `ROOM: ${roomCode}`;
    });
    
    socket.emit('join', roomCode);
}