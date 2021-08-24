export const startGame = () => {
    const gameCont = document.querySelector('main');
    const menuCont = document.querySelector('div.menu-container');
    const popup = document.querySelector('.pop-up-container');
    gameCont.style.display = 'block';
    menuCont.style.display = 'none';
    popup.style.display = 'none';

    advanceYearDots();
}

export const nextYear = (room, players, socket) => {
    document.getElementById('year').innerHTML = room.year + ' AD';

    players.forEach(player => {
        if (player.id == socket.id) {
            document.getElementById('pop').innerHTML = `Population: ${player.resources.pop}`;
            document.getElementById('gold').innerHTML = `Gold: ${player.resources.gold}`;
            document.getElementById('land').innerHTML = `Land: ${player.resources.land}<sup>2</sup>`;
            document.getElementById('wood').innerHTML = `Wood: ${player.resources.wood}`;
            document.getElementById('brick').innerHTML = `Brick: ${player.resources.brick}`;
            document.getElementById('iron').innerHTML = `Iron: ${player.resources.iron}`;
            document.getElementById('steel').innerHTML = `Steel: ${player.resources.steel}`;
        }
    })

    advanceYearDots();
}

const advanceYearDots = () => {
    document.querySelectorAll('.year-dot').forEach(yearDot => {
        yearDot.style.background = 'none';
    })

    for(let i = 1; i <= 5; i++) {
        setTimeout(() => {
            document.querySelector(`.dot-${i}`).style.background = '#fff';
        }, i * 2000);
    }
}