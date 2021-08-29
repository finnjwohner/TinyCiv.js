const { Socket } = require("socket.io");

const startGame = (gameReady, rooms, roomCode, io) => {
    if (gameReady) {
        const room = rooms.get(roomCode);
        const players = [];
        room.players.forEach(player => {
            for (let i = 0; i < 3; i++) {
                const rand = Math.floor(Math.random() * 4);
                switch(rand) {
                    case 0:
                        player.naturalResources.wood++;
                        player.resources.wood += 2;
                        break;
                    case 1:
                        player.naturalResources.brick++;
                        player.resources.brick += 2;
                        break;
                    case 2:
                        player.naturalResources.iron++;
                        player.resources.wood += 2;
                        break;
                    case 3:
                        player.naturalResources.steel++;
                        player.resources.steel += 2;
                        break;
                    default:
                        console.error('this should not happen ' + rand);
                        break;
                }
            }

            players.push(player);
        })

        setTimeout(() => {
            io.to(roomCode).emit('startGame', players);

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
        player.resources.wood += player.naturalResources.wood;
        player.resources.brick += player.naturalResources.brick;
        player.resources.iron += player.naturalResources.iron;
        player.resources.steel += player.naturalResources.steel;

        players.push(player);
    });

    io.to(roomCode).emit('nextYear', room, players);

    rooms.set(roomCode, room);
}

const buy = (socket, rooms, plyr, id, buyables) => {
    const room = rooms.get(plyr.roomCode);
    const player = room.players.get(plyr.id);

    if (player.resources.gold >= buyables[id].gold) {
        player.resources.gold -= buyables[id].gold;
        player.buildings[id]++;

        room.players.set(plyr.id, player);
        rooms.set(plyr.roomCode, room);

        socket.emit('buyMsg', `You bought a ${buyables[id].name} for ${buyables[id].gold} Gold / ${room.year} AD`);

        players = [];
        room.players.forEach(i => {
            players.push(i);
        })
        socket.emit('sendPlayerInfo', players);
    }
    else {
        socket.emit('errorMsg', `You can't afford a ${buyables[id].name}!`);
    }
}

module.exports = {startGame, buy};