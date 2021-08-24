const socket = io();

import * as lobby from './lobby_cl.js';
import * as game from './game_cl.js';

let enteredLobby = false;

lobby.initialJoin(socket);

// I define 'entering a lobby' as when the player has subbmited their info,
// e.g. name, kingdom name, avatar selected, and then pressed 'enter game'.
socket.on('playerEnteredLobby', player => {
    lobby.playerEnteredLobby(player, socket);
})

socket.on('playerJoining', player => {
    lobby.createPanel(player, enteredLobby, socket);
});

socket.on('playerLeaving', id => {
    lobby.playerLeaving(id);
});

socket.on('playerReadyToggleReceive', player => {
    lobby.readyBtnToggle(player);
});

socket.on('joinLobby', players => {
    players.forEach(player => {
        lobby.createPanel(player, enteredLobby, socket);
    })
});

socket.on('gameReady', players => {
    lobby.gameReady(players);
})

socket.on('startGame', players => {
    console.log(players);
    game.startGame();
    game.updateDisplays(players, socket.id);
})

socket.on('nextYear', (room, players) => {
    game.nextYear(room, players, socket);
})

document.getElementById('enterLobbyBtn').addEventListener('mousedown', () => {
    enteredLobby = lobby.enterLobby(socket);
})