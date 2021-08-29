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
            players.forEach(player => {
                io.to(player.id).emit('startGame', player);
            })

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

    room.players.forEach(player => {
        let yearMsg = "";

        player.resources.gold += 100 * player.resources.pop;
        yearMsg += `+${100 * player.resources.pop} Gold, `;

        if (player.naturalResources.wood != 0) {
            player.resources.wood += player.naturalResources.wood;
            yearMsg += `+${player.naturalResources.wood} Wood, `;
        }
        if (player.naturalResources.brick != 0) {
            player.resources.brick += player.naturalResources.brick;
            yearMsg += `+${player.naturalResources.brick} Brick, `;
        }
        if (player.naturalResources.iron != 0) {
            player.resources.iron += player.naturalResources.iron;
            yearMsg += `+${player.naturalResources.iron} Iron, `;
        }
        if (player.naturalResources.steel != 0) {
            player.resources.steel += player.naturalResources.steel;
            yearMsg += `+${player.naturalResources.steel} Steel, `;
        }

        io.to(player.id).emit('nextYear', room.year, player, yearMsg)
    });

    rooms.set(roomCode, room);
}

const buy = (socket, rooms, plyr, id, buyables) => {
    const room = rooms.get(plyr.roomCode);
    let player = room.players.get(plyr.id);

    let canBuy = true;
    let error = `You can't afford a ${buyables[id].name}!`;
    if (buyables[id].gold != undefined) {
        if (player.resources.gold < buyables[id].gold) {
            canBuy = false;
        }
    }
    if (buyables[id].pop != undefined) {
        if ((player.resources.food - player.resources.pop) < buyables[id].pop) {
            canBuy = false;
            error = `Not enough food for ${buyables[id].name}!`;
        }
    }

    if (canBuy) {
        if (buyables[id].gold != undefined) { player.resources.gold -= buyables[id].gold; }

        if (buyables[id].func != undefined) {
            player = buyables[id].func(player);
        }

        player.buildings[id]++;

        room.players.set(plyr.id, player);
        rooms.set(plyr.roomCode, room);

        socket.emit('buyMsg', `You bought a ${buyables[id].name} for ${buyables[id].gold} Gold / ${room.year} AD`);

        socket.emit('sendPlayerInfo', player);
    }
    else {
        socket.emit('errorMsg', error);
    }
}

module.exports = {startGame, buy};