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

    updateDisplays(players, socket.id);

    advanceYearDots();
}

export const updateDisplays = (players, socketId) => {
    players.forEach(player => {
        if (player.id == socketId) {
            document.getElementById('land-resources').innerHTML = `${player.kingdom}'s Natural Resources`;
            document.getElementById('land-geo').innerHTML = `${player.kingdom}'s Geography`;

            document.getElementById('pop').innerHTML = `Population: ${player.resources.pop}`;
            document.getElementById('gold').innerHTML = `Gold: ${player.resources.gold}`;
            document.getElementById('land').innerHTML = `Land: ${player.resources.land}km<sup>2</sup>`;
            document.getElementById('wood').innerHTML = `Wood: ${player.resources.wood}`;
            document.getElementById('brick').innerHTML = `Brick: ${player.resources.brick}`;
            document.getElementById('iron').innerHTML = `Iron: ${player.resources.iron}`;
            document.getElementById('steel').innerHTML = `Steel: ${player.resources.steel}`;

            const woodResource = document.getElementById('wood-resource');
            const brickResource = document.getElementById('brick-resource');
            const ironResource = document.getElementById('iron-resource');
            const steelResource = document.getElementById('steel-resource');
            if (player.naturalResources.wood != 0)
                woodResource.innerHTML = `${player.naturalResources.wood}x Wood (${player.naturalResources.wood} per year)`;
            else
                woodResource.innerHTML = '';
            
            if(player.naturalResources.brick != 0)
                brickResource.innerHTML = `${player.naturalResources.brick}x Brick (${player.naturalResources.brick} per year)`;
            else
                brickResource.innerHTML = '';

            if (player.naturalResources.iron != 0)
                ironResource.innerHTML = `${player.naturalResources.iron}x Iron (${player.naturalResources.iron} per year)`;
            else
                ironResource.innerHTML = '';

            if (player.naturalResources.steel != 0)
                steelResource.innerHTML = `${player.naturalResources.steel}x Steel (${player.naturalResources.steel} per year)`;
            else
                steelResource.innerHTML = '';
        }
    })
}

export const yearSummary = msg => {
    const yearSummary = document.getElementById('year-summary');
    yearSummary.innerHTML = msg;
    yearSummary.classList.remove('opacity-transition');
    yearSummary.style.opacity = 1;
    setTimeout(() => {
        yearSummary.classList.add('opacity-transition');
        yearSummary.style.opacity = 0;
    }, 10)
}

export const errorMsg = msg => {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.innerHTML = msg;
    errorMsg.classList.remove('opacity-transition');
    errorMsg.style.opacity = 1;
    setTimeout(() => {
        errorMsg.classList.add('opacity-transition');
        errorMsg.style.opacity = 0;
    }, 10)
}

export const buyMsg = msg => {
    const buyMsg = document.getElementById('buy-msg');
    buyMsg.innerHTML = msg;
    buyMsg.style.visibility = 'visible';
}

const advanceYearDots = () => {
    setTimeout(() => {
        document.querySelectorAll('.year-dot').forEach(yearDot => {
            yearDot.style.background = 'none';
        })
    }, 10)

    for(let i = 1; i <= 10; i++) {
        setTimeout(() => {
            document.querySelector(`.dot-${i}`).style.background = '#fff';
        }, i * 1000);
    }
}

export const setPlayer = (player, players, socketId) => {
    players.forEach(plyr => {
        if (plyr.id == socketId) {player = plyr};
    })
}