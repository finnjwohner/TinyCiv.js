const setBuyables = (buyables, socket) => {
    const detailsBox = document.querySelector('.details-box');
    const buildingsBuyPanel = document.querySelector('div.buildingBuyable');
    const unitsBuyPanel = document.querySelector('div.unitBuyable');
    const geoBuyPanel = document.querySelector('div.geoBuy');

    const detailsh2 = document.querySelector('.details-box h2');
    const detailsp = document.querySelector('.details-box p');


    Object.entries(buyables).forEach(buyable => {
        const buyBtn = document.createElement('button');
        buyBtn.innerHTML = buyable[1].name;
        buyBtn.classList.add('buyBtn');
        buyBtn.id = buyable[0]

        let cost = `Cost: ${buyable[1].gold} Gold`;
        if (buyable[1].wood != undefined) {
            cost += `, ${buyable[1].wood} Wood`;
        }
        if (buyable[1].brick != undefined) {
            cost += `, ${buyable[1].brick} Brick`;
        }
        if (buyable[1].iron != undefined) {
            cost += `, ${buyable[1].iron} Iron`;
        }
        if (buyable[1].steel != undefined) {
            cost += `, ${buyable[1].steel} Steel`;
        }

        if(buyable[1].type == "building") {
            buildingsBuyPanel.appendChild(buyBtn);
        }
        else if (buyable[1].type == "unit") {
            unitsBuyPanel.appendChild(buyBtn);
        }
        else if (buyable[1].type == "explore") {
            buyBtn.innerHTML = "Explore More Land";
            geoBuyPanel.appendChild(buyBtn);
        }

        buyBtn.addEventListener('mouseover', (e) => {
            detailsBox.style.display = 'block';
            detailsh2.innerHTML = buyable[1].name;
            detailsp.innerHTML = `${cost}<br>${buyable[1].desc}`;
        })
        buyBtn.addEventListener('mouseleave', (e) => {
            detailsBox.style.display = 'none';
        })
        buyBtn.addEventListener('mousedown', () => {
            socket.emit('buy', buyable[0]);
        })
    })

    document.addEventListener('mousemove', function(e) {
        let left = e.pageX + 20;
        let top = e.pageY + 20;
        detailsBox.style.left = left + 'px';
        detailsBox.style.top = top + 'px';
    });
}

export default setBuyables;