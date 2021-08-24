const details = {
    granary: ['Granary', 'gets stuff'],
    windmill: ['Windmill', 'gives the good wind'],
    fishery: ['Fishery', 'i really shouldn\'t'],
    cattle: ['Cattle Farm', 'the beeeeeeef'],
    dockyard: ['Dockyard', 'excuse the little girl she\'s just a human'],
    stable: ['Stable', 'Well that man is freaky af'],
    swordsman: ['Swordsman', 'swordy swordy swordy'],
    knight: ['Knight', 'KNIGHT JASPER'],
    lancer: ['Lancer', 'you get the jist of it'],
    galley: ['Galley', 'bro im so bored of typing'],
    longship: ['Longship', 'this is so tedius'],
    explore: ['Explore', 'gain more land !!!'],
}

const detailsBox = document.querySelector('.details-box');
const detailsh2 = document.querySelector('.details-box h2');
const detailsp = document.querySelector('.details-box p');

const buyBtns = document.querySelectorAll('.buyBtn');

buyBtns.forEach(buyBtn => {
    buyBtn.addEventListener('mouseover', (e) => {
        detailsBox.style.display = 'block';
        detailsh2.innerHTML = details[e.toElement.id][0];
        detailsp.innerHTML = details[e.toElement.id][1];
    })
    buyBtn.addEventListener('mouseleave', (e) => {
        detailsBox.style.display = 'none';
    })
})

document.addEventListener('mousemove', function(e) {
    let left = e.pageX + 20;
    let top = e.pageY + 20;
    detailsBox.style.left = left + 'px';
    detailsBox.style.top = top + 'px';
  });