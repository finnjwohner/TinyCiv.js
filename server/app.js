  const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const lobby = require('./lobby_sv.js');
const game = require('./game_sv.js');
const Player = require('./player.js');
const Buyables = require('./buyables.js');

const buyables = new Buyables();
const rooms = new Map();

app.use(express.static(path.join(__dirname, '../public')));

app.all('/howtoplay', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/howtoplay.html'));
})

// Handle requests to url that contain a room code (join that room)
app.all('/:roomCode', (req, res) => {
    const code = req.params.roomCode;
    res.set('roomCode', code);
    if (!isNaN(code) && code.length == 5) {
        if (rooms.has(code)) {
            res.sendFile(path.join(__dirname, '../public/room.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

io.on('connection', socket => {
    console.log(`New socket connection established with ${socket.id}...`);

    let player = new Player(socket.id);

    socket.on('startNewGame', () => {
        lobby.newGame(socket, rooms);
    });

    socket.on('join', code => {
        lobby.joinGame(socket, rooms, player, code);
    })

    socket.on('enterLobby', (avatar, playerName, kingdom) => {
        lobby.enterLobby(io, rooms, player, avatar, playerName, kingdom);
    });

    socket.on('playerReadyToggle', playerBtnId => {
        const gameReady = lobby.togglePlayerReady(socket, rooms, player, io, playerBtnId);
        game.startGame(gameReady, rooms, player.roomCode, io);
    })

    socket.on('disconnect', () => {
        lobby.disconnect(player, rooms, io, socket);
    })

    socket.on('buy', id => {
        game.buy(socket, rooms, player, id, buyables);
    })
})

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`TinyCiv server running on port ${port}`);
});