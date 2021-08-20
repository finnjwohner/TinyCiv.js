const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, './public')));

app.all('/howtoplay', (req, res) => {
    res.sendFile(path.join(__dirname, './public/howtoplay.html'));
})

// Handle requests to url that contain a room code (join that room)
app.all('/:roomCode', (req, res) => {
    const code = req.params.roomCode;
    res.set('roomCode', code);
    if (!isNaN(code) && code.length == 5) {
        if (rooms.has(code)) {
            res.sendFile(path.join(__dirname, './public/room.html'));
            return;
        }
    }
    res.sendFile(path.join(__dirname, './public/index.html'));
})

const rooms = new Map();

io.on('connection', socket => {
    console.log(`New socket connection established with ${socket.id}...`);

    let player = {
        entered: false,
        avatar: undefined,
        id: socket.id,
        name: undefined,
        roomCode: undefined,
        kingdom: undefined,
    }

    socket.on('startNewGame', () => {
        let newCode = '';
        do {
            newCode = Math.floor(Math.random() * 100000).toString();
        } while (rooms.has(newCode));

        while (newCode.length < 5) {
            newCode = '0' + newCode;
        }

        rooms.set(newCode, {
            started: false,
            roomCode: newCode,
            players: new Map()
        })

        console.log(`Created new room ${newCode}`);
        socket.emit('acceptNewGame', newCode);
    });

    socket.on('join', code => {
        player.roomCode = code;
        socket.join(player.roomCode);

        const room = rooms.get(code);
        room.players.set(player.id, player);
        rooms.set(code, room);

        players = [];
        room.players.forEach(value => {
            players.push(value);
        })
        socket.emit('joinLobby', players);
        socket.to(player.roomCode).emit('playerJoining', player);

        console.log(`${player.id} joined room ${code}`);
    })

    socket.on('enterLobby', (avatar, playerName, kingdom) => {
        player.avatar = avatar;
        player.name = playerName;
        player.kingdom = kingdom;
        player.entered = true;

        const room = rooms.get(player.roomCode);
        room.players.set(player.id, player);
        rooms.set(player.roomCode, room);

        io.to(player.roomCode).emit('playerEnteredLobby', player);
    });

    socket.on('disconnect', () => {
        if (player.roomCode) {
            const room = rooms.get(player.roomCode);
            room.players.delete(player.id);

            io.to(player.roomCode).emit('playerLeaving', socket.id);

            if(room.players.size == 0) {
                console.log(`${player.id} (${player.name}) left room ${player.roomCode}`);
                console.log(`Deleted empty room ${player.roomCode}`);
                rooms.delete(player.roomCode);
            }
            else {
                console.log(`${player.id} (${player.name}) left room ${player.roomCode}`);
                rooms.set(player.roomCode, room);
            }
        }
    })
})

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`TinyCiv server running on port ${port}`);
});