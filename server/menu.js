const newGame = (socket, rooms) => {
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
            players: new Map(),
            colours: ['red', 'green', 'blue', 'purple'],
        })

        console.log(`Created new room ${newCode}`);
        socket.emit('acceptNewGame', newCode);
}

const joinGame = (socket, rooms, player, code) => {
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
}

const enterLobby = (io, rooms, player, avatar, playerName, kingdom) => {
    player.avatar = avatar;
    player.name = playerName;
    player.kingdom = kingdom;
    player.entered = true;

    const room = rooms.get(player.roomCode);

    const colour = Math.floor(Math.random() * room.colours.length);
    player.colour = room.colours[colour];
    room.colours.splice(colour, 1);

    room.players.set(player.id, player);
    rooms.set(player.roomCode, room);

    io.to(player.roomCode).emit('playerEnteredLobby', player);
}

const togglePlayerReady = (socket, rooms, player, io, playerBtnId) => {
    if (socket.id == playerBtnId) {
        const room = rooms.get(player.roomCode);

        player.ready = !player.ready;

        rooms.set(player.roomCode, room);

        io.to(player.roomCode).emit('playerReadyToggleReceive', player);
    }
}

const disconnect = (player, rooms, io, socket) => {
    if (player.roomCode) {
        const room = rooms.get(player.roomCode);
        room.colours.push(player.colour);
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
}

module.exports = {newGame, joinGame, enterLobby, togglePlayerReady, disconnect};