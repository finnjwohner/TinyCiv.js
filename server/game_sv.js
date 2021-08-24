const startGame = (gameReady, rooms, roomCode, io) => {
    if (gameReady) {
        const room = rooms.get(roomCode);

        setTimeout(() => {
            io.to(roomCode).emit('startGame');

            room.yearIntervalId = setInterval(() => {
                nextYear(rooms, roomCode, io);
            }, 10000);

            rooms.set(roomCode, room);
        }, 3000)
    }
}

const nextYear = (rooms, roomCode, io) => {
    const room = rooms.get(roomCode);

    room.year = room.year + 1;

    let players = [];
    room.players.forEach(player => {
        players.push(player);
    });

    io.to(roomCode).emit('nextYear', room, players);

    rooms.set(roomCode, room);
}

module.exports = {startGame};